const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function testCSVExport() {
    let options = new chrome.Options();

    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    try {
        console.log("Opening Student Attendance System...");

        await driver.get(
            "file:///C:/Users/rayas/Student-Attendance-System/frontend/index.html"
        );

        await driver.wait(
            until.elementLocated(By.css("h1")),
            10000
        );

        console.log("Opening Monthly Report...");

        const monthInput = await driver.findElement(
            By.id("reportMonth")
        );

        await monthInput.clear();
        await monthInput.sendKeys("2026-10");

        const reportButton = await driver.findElement(
            By.xpath("//button[contains(text(),'Generate Report')]")
        );

        await reportButton.click();

        await driver.sleep(1000);

        console.log("Checking CSV export button...");

        const exportButton = await driver.findElement(
            By.id("exportCsvBtn")
        );

        const isDisplayed = await exportButton.isDisplayed();

        if (!isDisplayed) {
            throw new Error("CSV Export button is not displayed.");
        }

        console.log("TEST PASSED: CSV export option is available.");

    } catch (error) {
        console.error("TEST FAILED:", error.message);
        process.exitCode = 1;

    } finally {
        await driver.quit();
    }
}

testCSVExport();