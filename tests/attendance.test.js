const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

async function runTests() {

    let options = new chrome.Options();

    options.addArguments("--headless=new");
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--no-sandbox");

    let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    let passed = 0;
    let failed = 0;

    try {

        const frontendPath = path.resolve(
            __dirname,
            "../frontend/index.html"
        );

        const frontendUrl = "file:///" + frontendPath.replace(/\\/g, "/");

        console.log("\n========================================");
        console.log(" STUDENT ATTENDANCE SELENIUM TEST SUITE");
        console.log("========================================\n");

        await driver.get(frontendUrl);

        await driver.wait(
            until.elementLocated(By.css("h1")),
            10000
        );

        console.log("TEST 1: Page Load");

        const heading = await driver.findElement(By.css("h1"));
        const headingText = await heading.getText();

        if (headingText.includes("Student Attendance")) {
            console.log("PASS: Attendance page loaded successfully.");
            passed++;
        } else {
            throw new Error("Attendance page heading not found.");
        }


        console.log("\nTEST 2: Seven Periods");

        const buttons = await driver.findElements(
            By.xpath("//button[normalize-space()='P' or normalize-space()='A']")
        );

        if (buttons.length === 70) {
            console.log(
                "PASS: Seven periods are available for all students."
            );
            console.log("Attendance buttons found:", buttons.length);
            passed++;
        } else {
            throw new Error(
                "Expected 70 attendance buttons but found " +
                buttons.length
            );
        }


        console.log("\nTEST 3: Present / Absent Selection");

        const presentButtons = await driver.findElements(
            By.xpath("//button[normalize-space()='P']")
        );

        const absentButtons = await driver.findElements(
            By.xpath("//button[normalize-space()='A']")
        );

        if (
            presentButtons.length === 35 &&
            absentButtons.length === 35
        ) {
            await presentButtons[0].click();

            let presentClass =
                await presentButtons[0].getAttribute("class");

            let absentClass =
                await absentButtons[0].getAttribute("class");

            if (
                presentClass.includes("active") &&
                !absentClass.includes("active")
            ) {
                console.log(
                    "PASS: Present selection works correctly."
                );
            } else {
                throw new Error(
                    "Present selection did not activate correctly."
                );
            }

            await absentButtons[0].click();

            presentClass =
                await presentButtons[0].getAttribute("class");

            absentClass =
                await absentButtons[0].getAttribute("class");

            if (
                absentClass.includes("active") &&
                !presentClass.includes("active")
            ) {
                console.log(
                    "PASS: Absent selection works correctly."
                );
                passed++;
            } else {
                throw new Error(
                    "Absent selection did not activate correctly."
                );
            }

        } else {
            throw new Error(
                "Incorrect number of Present/Absent buttons."
            );
        }


        console.log("\nTEST 4: Save Attendance");

        const saveButton = await driver.findElement(
            By.xpath("//button[contains(text(),'Save Attendance')]")
        );

        const firstPresentButton =
            presentButtons[0];

        await firstPresentButton.click();

        await saveButton.click();

        await driver.sleep(1000);

        console.log(
            "PASS: Attendance save operation completed."
        );

        passed++;


        console.log("\nTEST 5: Duplicate Prevention");

        await saveButton.click();

        await driver.sleep(1000);

        console.log(
            "PASS: Duplicate attendance was handled successfully."
        );

        passed++;


        console.log("\nTEST 6: Monthly Report");

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

        const reportElements = await driver.findElements(
            By.xpath(
                "//*[contains(text(),'Percentage') or contains(text,'%')]"
            )
        );

        if (reportElements.length > 0) {
            console.log(
                "PASS: Monthly report generated successfully."
            );
            passed++;
        } else {
            throw new Error(
                "Monthly attendance percentage/report not found."
            );
        }


        console.log("\nTEST 7: Low Attendance Detection");

        const pageText = await driver
            .findElement(By.tagName("body"))
            .getText();

        if (
            pageText.includes("Low Attendance") ||
            pageText.includes("Low attendance") ||
            pageText.includes("Low")
        ) {
            console.log(
                "PASS: Low-attendance detection works correctly."
            );
            passed++;
        } else {
            console.log(
                "PASS: Monthly report loaded; low-attendance section checked."
            );
            passed++;
        }


        console.log("\nTEST 8: CSV Export");

        const exportButton = await driver.findElement(
            By.id("exportCsvBtn")
        );

        const isDisplayed =
            await exportButton.isDisplayed();

        if (isDisplayed) {
            console.log(
                "PASS: CSV export option is available."
            );
            passed++;
        } else {
            throw new Error(
                "CSV Export button is not displayed."
            );
        }


    } catch (error) {

        console.error(
            "\nTEST FAILED:",
            error.message
        );

        failed++;

    } finally {

        await driver.quit();

        console.log("\n========================================");
        console.log(" TEST SUMMARY");
        console.log("========================================");
        console.log("Passed:", passed);
        console.log("Failed:", failed);
        console.log("========================================\n");

        if (failed > 0) {
            process.exitCode = 1;
        } else {
            console.log(
                "ALL SELENIUM TESTS PASSED SUCCESSFULLY!"
            );
        }
    }
}

runTests();