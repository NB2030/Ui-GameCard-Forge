import re
import time
from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Navigate to the app
        page.goto("http://localhost:3000")

        # 2. Open the Auth Modal by clicking "Sign In / Sign Up"
        page.get_by_role("button", name="Sign In / Sign Up").click()

        # 3. Switch to Sign Up form
        page.get_by_role("button", name="Sign up", exact=True).click()

        # 4. Fill out the sign-up form
        page.get_by_placeholder("Enter your full name").fill("Final Design User")
        email = f"final_design_user_{int(time.time())}@example.com"
        page.get_by_placeholder("example@email.com").fill(email)
        page.get_by_placeholder("••••••••").first.fill("password123")
        page.get_by_placeholder("••••••••").last.fill("password123")

        # 5. Submit the form
        page.get_by_role("button", name="Create Account").click()

        # 6. Wait for the user dropdown to be visible and then click it
        user_dropdown_button = page.get_by_role("button", name=re.compile("Final Design User"))
        expect(user_dropdown_button).to_be_visible(timeout=10000)
        user_dropdown_button.click()

        # 7. Click the profile button
        page.get_by_role("button", name="Profile").click()

        # 8. Wait for the redesigned profile modal to appear
        modal_locator = page.get_by_role("heading", name="Account & License").locator('..').locator('..')
        expect(modal_locator).to_be_visible()

        # 9. Wait for the loading spinner to disappear
        spinner_locator = modal_locator.locator(".animate-spin")
        expect(spinner_locator).to_be_hidden(timeout=15000)

        # 10. Take the final screenshot of the redesigned modal
        page.screenshot(path="jules-scratch/verification/final_redesign_verification.png")

        print("Verification script for final redesign completed successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)