const JUDGE0_API = "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
};

export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    // Step 1: Submit the code
    const submitRes = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
      }),
    });

    const submitData = await submitRes.json();
    const token = submitData.token;

    // Step 2: Wait a bit before first check
    await new Promise((res) => setTimeout(res, 2000));

    // Step 3: Poll for the result
    let data;
    for (let i = 0; i < 10; i++) {
      const resultRes = await fetch(
        `${JUDGE0_API}/submissions/${token}?base64_encoded=false`
      );
      data = await resultRes.json();

      if (data.status.id !== 1 && data.status.id !== 2) break;

      // Still processing, wait before retrying
      await new Promise((res) => setTimeout(res, 1500));
    }

    const output = data.stdout || "";
    const stderr = data.stderr || data.compile_output || "";

    if (stderr) {
      return { success: false, output, error: stderr };
    }

    return { success: true, output: output || "No output" };

  } catch (error) {
    return { success: false, error: `Failed to execute code: ${error.message}` };
  }
}