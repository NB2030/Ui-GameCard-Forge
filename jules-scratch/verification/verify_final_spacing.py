from playwright.sync_api import Page, expect

def test_final_layout_and_spacing(page: Page):
    """
    This test verifies the final layout and tab button spacing.
    """

    # 1. Arrange: Go to the application's homepage.
    page.goto("http://localhost:3000/")

    # 2. Assert: Wait for a key element to be visible to ensure the page has loaded.
    content_tab = page.get_by_role("button", name="Content")
    expect(content_tab).to_be_visible()

    # 3. Screenshot: Capture the entire page to visually verify the final layout.
    page.screenshot(path="jules-scratch/verification/final_spacing_verification.png")