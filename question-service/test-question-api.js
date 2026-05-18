import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Generate admin token
const adminToken = jwt.sign(
    { id: '60d5ecb8b392d7001f3e3901', role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
);

// Generate teacher token
const teacherToken = jwt.sign(
    { id: '60d5ecb8b392d7001f3e3902', role: 'teacher' },
    JWT_SECRET,
    { expiresIn: '1h' }
);

// Generate student token
const studentToken = jwt.sign(
    { id: '60d5ecb8b392d7001f3e3903', role: 'student' },
    JWT_SECRET,
    { expiresIn: '1h' }
);

const BASE_URL = 'http://localhost:5003/api/questions';

const makeRequest = async (method, path, body = null, token = adminToken) => {
    const headers = {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
    };
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
};

const runTests = async () => {
    let passed = 0;
    let failed = 0;
    let createdQuestionId = null;

    console.log("================================================");
    console.log("🧪 Question Service API Testing");
    console.log("================================================\n");

    const assertTest = (name, condition) => {
        if (condition) {
            console.log(`✅ PASSED: ${name}`);
            passed++;
        } else {
            console.log(`❌ FAILED: ${name}`);
            failed++;
        }
    };

    // Test 1: Create Question (Admin)
    const validMCQ = {
        type: "single_choice",
        questionText: "What is 2 + 2?",
        options: [
            { optionId: "A", text: "3" },
            { optionId: "B", text: "4" },
            { optionId: "C", text: "5" },
            { optionId: "D", text: "6" }
        ],
        correctAnswer: "B",
        marks: 4,
        negativeMarks: 1,
        subject: "Math",
        topic: "Addition",
        difficulty: "easy"
    };

    const res1 = await makeRequest('POST', '/', validMCQ, adminToken);
    assertTest("Create valid MCQ Question (Admin)", (res1.status === 201 || res1.status === 200) && res1.data.success);
    if(res1.status === 201 || res1.status === 200) {
        createdQuestionId = res1.data.data?._id || res1.data.question?._id || res1.data.id || (res1.data.data && res1.data.data.id) || (res1.data && res1.data._id);
        if(!createdQuestionId && res1.data.data) {
           createdQuestionId = res1.data.data._id;
        }
    }

    // Test 2: Create Question (Student - Should Fail)
    const res2 = await makeRequest('POST', '/', validMCQ, studentToken);
    assertTest("Create Question with Student Role (Should Fail 403)", res2.status === 403 || res2.status === 401);

    // Test 3: Create Question with Invalid Schema (Missing correctAnswer)
    const invalidMCQ = { ...validMCQ, correctAnswer: undefined };
    const res3 = await makeRequest('POST', '/', invalidMCQ, adminToken);
    assertTest("Create Question with Invalid Schema (Missing Correct Answer)", res3.status === 400 || res3.status === 422);

    // Test 4: Get All Questions
    const res4 = await makeRequest('GET', '/');
    assertTest("Get All Questions", res4.status === 200 && (Array.isArray(res4.data.data) || Array.isArray(res4.data.questions) || Array.isArray(res4.data.data?.records)));

    // Test 5: Get Question By ID
    if (createdQuestionId) {
        const res5 = await makeRequest('GET', `/${createdQuestionId}`);
        assertTest("Get Question By ID", res5.status === 200);

        // Test 6: Update Question
        const updateData = { marks: 5 };
        const res6 = await makeRequest('PUT', `/${createdQuestionId}`, updateData, adminToken);
        assertTest("Update Question", res6.status === 200);
        
        // Test 7: Delete Question (Soft Delete)
        const res7 = await makeRequest('DELETE', `/${createdQuestionId}`, null, adminToken);
        assertTest("Soft Delete Question", res7.status === 200);

        // Test 8: Get Soft Deleted Question By ID (Should still return or 404 depending on impl)
        const res8 = await makeRequest('GET', `/${createdQuestionId}`);
        // usually soft delete means isActive is false, it might still return it or not. Let's just pass if it runs without 500
        assertTest("Get Soft Deleted Question", res8.status === 200 || res8.status === 404);
    } else {
        console.log("⚠️ Skipping ID-dependent tests because creation failed.");
    }

    console.log("\n================================================");
    console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
    console.log("================================================");

    process.exit(failed > 0 ? 1 : 0);
};

runTests();
