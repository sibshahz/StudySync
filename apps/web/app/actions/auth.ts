"use server";

export async function signIn(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Sign in attempt:", { email, password });

  // Simulate authentication logic
  if (email && password) {
    return {
      success: true,
      message: "Successfully signed in!",
    };
  }

  return {
    success: false,
    message: "Invalid credentials",
  };
}

export async function signUp(formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const hasReferral = formData.get("hasReferral") === "on";
  const signUpCode = formData.get("signUpCode") as string;

  console.log("Sign up attempt:", {
    email,
    password,
    confirmPassword,
    hasReferral,
    signUpCode,
  });

  // Basic validation
  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  if (hasReferral && !signUpCode) {
    return {
      success: false,
      message: "Sign up code is required when using referral",
    };
  }

  // Simulate successful signup
  return {
    success: true,
    message: hasReferral
      ? `Successfully signed up with referral code: ${signUpCode}!`
      : "Successfully signed up!",
  };
}
