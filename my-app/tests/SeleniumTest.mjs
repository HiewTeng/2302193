import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

const environment = process.argv[2] || 'local';

const seleniumUrl = environment === 'github'
  ? 'http://selenium:4444/wd/hub'
  : 'http://localhost:4444/wd/hub';

const serverUrl = environment === 'github'
  ? 'http://testserver:3001'
  : 'http://host.docker.internal:3001';

console.log(`Running tests in '${environment}' environment`);
console.log(`Selenium URL: ${seleniumUrl}`);
console.log(`Server URL: ${serverUrl}`);

(async function runTests() {
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(seleniumUrl)
    .build();

  try {
    await driver.get(serverUrl);
    const input = await driver.findElement(By.css("input"));
    const submitButton = await driver.findElement(By.css("button[type='submit']"));

    // ---------- Test 1: Valid input ----------
    await input.clear();
    await input.sendKeys("apple");
    await submitButton.click();
    const resultText = await driver.wait(until.elementLocated(By.css(".result-box p")), 3000).getText();
    assert.ok(resultText.includes("apple"), "Expected search result to include 'apple'");
    console.log("✅ Test 1 Passed: Valid input shows result");

    // ---------- Go back to home ----------
    await driver.findElement(By.css(".result-box button")).click();

    // 🔁 RE-LOCATE elements after rerender
    await driver.wait(until.elementLocated(By.css("input")), 2000);
    const input2 = await driver.findElement(By.css("input"));
    const submitButton2 = await driver.findElement(By.css("button[type='submit']"));

    // ---------- Test 2: XSS input ----------
    await input2.clear();
    await input2.sendKeys("<script>alert(1)</script>");
    await submitButton2.click();
    const xssError = await driver.wait(until.elementLocated(By.css(".error")), 3000).getText();
    assert.ok(xssError.includes("XSS Detected"), "Expected XSS error message");
    console.log("✅ Test 2 Passed: XSS input was blocked");

    // ---------- Test 3: SQL Injection ----------
    await input2.clear();
    await input2.sendKeys("' OR '1'='1");
    await submitButton2.click();
    const sqlError = await driver.wait(until.elementLocated(By.css(".error")), 3000).getText();
    assert.ok(sqlError.includes("SQL Injection Detected"), "Expected SQL Injection error message");
    console.log("✅ Test 3 Passed: SQL injection input was blocked");

    // ---------- Test 4: Empty input ----------
    await input2.clear();
    await submitButton2.click();
    const emptyError = await driver.wait(until.elementLocated(By.css(".error")), 3000).getText();
    assert.ok(emptyError.includes("Input is empty"), "Expected empty input error message");
    console.log("✅ Test 4 Passed: Empty input was blocked");

  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    await driver.quit();
  }
})();
