// Test script to verify signup process
// Run this in browser console to test signup

async function testSignup() {
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
  };

  console.log("Testing signup with:", testData);

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log("Signup result:", result);

    if (result.success) {
      console.log("✅ Signup successful!");
      console.log("User ID:", result.userId);
      console.log("Email:", result.email);
      console.log("Redirect to verification:", result.redirectToVerification);
    } else {
      console.log("❌ Signup failed:", result.message);
      console.log("Details:", result.details);
    }
  } catch (error) {
    console.error("❌ Test error:", error);
  }
}

// Run the test
testSignup();
