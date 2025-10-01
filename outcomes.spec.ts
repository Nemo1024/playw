import { test, expect } from '@playwright/test';
import { OutcomesPage } from '../pages/OutcomesPage';
import { OutcomesTestHelpers } from './helpers/outcomes-test-helpers';
import { TEST_DATA } from './test-data/outcomes-test-data';

test.describe('Outcomes Page Tests', () => {
  let outcomesPage: OutcomesPage;
  let testHelpers: OutcomesTestHelpers;

  test.beforeEach(async ({ page }) => {
    outcomesPage = new OutcomesPage(page);
    testHelpers = new OutcomesTestHelpers(outcomesPage);
    await outcomesPage.navigateToOutcomes();
  });

  test.describe('Page Components', () => {

  test('verify outcomes list page components', async ({ page }) => {
    // Verify calc.html element is present
    await outcomesPage.verifyCalcElementPresent();

    // Verify page title is "Outcomes"
    await outcomesPage.verifyTitle();

    // Verify table is displayed
    await outcomesPage.verifyTableIsDisplayed();

    // Verify all required table columns are present
    await outcomesPage.verifyTableColumns();

    // Verify specific column headers with exact text
    await expect(outcomesPage.tableHeaders.outputType).toContainText('Output type');
    await expect(outcomesPage.tableHeaders.outputChoice).toContainText('Output choice');
    await expect(outcomesPage.tableHeaders.dateCreated).toContainText('Date Created');
    await expect(outcomesPage.tableHeaders.updatedAt).toContainText('Updated at');
    await expect(outcomesPage.tableHeaders.actions).toContainText('Actions');

    // Verify "Create an Outcome" button is present and clickable
    await outcomesPage.verifyCreateOutcomeButton();
    await expect(outcomesPage.createOutcomeButton).toBeEnabled();
  });

  test('verify new outcome drawer components', async ({ page }) => {
    // Click on "Create an outcome" button to open the drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Verify drawer is shown and contains the calcDrawer element
    await outcomesPage.verifyCalcDrawerElement();

    // Verify outcome name input field is displayed and is empty
    await outcomesPage.verifyOutcomeNameInput();

    // Verify output choices are displayed with default ones: "Route to labs", "Refer to UW", and "Offer"
    await outcomesPage.verifyOutputChoices();

    // Verify each choice has edit and delete buttons next to it
    await outcomesPage.verifyEditAndDeleteButtons();

    // Verify "Add" button is displayed
    await outcomesPage.verifyAddButton();

    // Verify cancel and save buttons are displayed, with save button grayed out
    await outcomesPage.verifyCancelAndSaveButtons();
  });

  test('verify add new output for a new outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome';
    const newOutputValue = 'Custom Output Value';

    // Open the drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Input a name in the name input field
    await outcomesPage.enterOutcomeName(outcomeName);

    // Click on "Add value"
    await outcomesPage.clickAddValueButton();

    // Verify a new input field for the new value is displayed
    // Verify cancel button and grayed out "confirm" button are displayed
    await outcomesPage.verifyAddValueComponentIsVisible();

    // Input a name for the new output value
    await outcomesPage.enterNewOutputValue(newOutputValue);

    // Verify confirm button is not grayed out
    await outcomesPage.verifyConfirmButtonEnabled();

    // Click cancel - "add value" component is hidden
    await outcomesPage.clickAddValueCancelButton();
    await outcomesPage.verifyAddValueComponentIsHidden();

    // Open again "add value" component
    await outcomesPage.clickAddValueButton();
    await outcomesPage.enterNewOutputValue(newOutputValue);

    // Now click confirm - new value is shown in the outputs list
    await outcomesPage.clickAddValueConfirmButton();
    await outcomesPage.verifyNewOutputValueInList(newOutputValue);

    // Click save on the drawer - drawer is closed
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify new outcome is shown in the list
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('verify edit output for a new outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Edit';
    const originalOutputValue = 'Route to labs';
    const newOutputValue = 'Updated Route to Labs';

    // Go to outcomes page and open the drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Add a name for the outcome
    await outcomesPage.enterOutcomeName(outcomeName);

    // Click on edit next to an output (Route to labs)
    await outcomesPage.clickEditButtonForOutput(originalOutputValue);

    // Verify edit component is visible
    await outcomesPage.verifyEditValueComponentIsVisible();

    // Change the name
    await outcomesPage.clearAndEnterEditValue(newOutputValue);

    // Click cancel - name is not changed
    await outcomesPage.clickEditValueCancelButton();
    await outcomesPage.verifyOutputValueUnchanged(originalOutputValue);
    await outcomesPage.verifyEditValueComponentIsHidden();

    // Edit again
    await outcomesPage.clickEditButtonForOutput(originalOutputValue);
    await outcomesPage.clearAndEnterEditValue(newOutputValue);

    // Now click confirm - name of output is changed
    await outcomesPage.clickEditValueConfirmButton();
    await outcomesPage.verifyOutputValueChanged(originalOutputValue, newOutputValue);

    // Click save button - drawer is closed
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify new outcome with corresponding name is present in the list of outcomes
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('delete output for a new outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Delete';
    const outputToDelete = 'Route to labs';
    const remainingOutputs = ['Refer to UW', 'Offer'];

    // Go to outcomes page and open the drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Add a name for the outcome
    await outcomesPage.enterOutcomeName(outcomeName);

    // Verify initially there are 3 outputs
    await outcomesPage.verifyOutputCount(3);

    // Click on delete next to an output (Route to labs)
    await outcomesPage.clickDeleteButtonForOutput(outputToDelete);

    // Verify the output is deleted
    await outcomesPage.verifyOutputValueDeleted(outputToDelete);

    // Check only 2 outputs are remaining after delete
    await outcomesPage.verifyOutputCount(2);

    // Verify the remaining outputs are correct
    await outcomesPage.verifyRemainingOutputs(remainingOutputs);

    // Click save button - drawer is closed
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify new outcome is present in the list of outcomes
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('verify duplicate name of a new outcome', async ({ page }) => {
    const duplicateOutcomeName = 'Duplicate Test Outcome';

    // First, create an outcome with a specific name
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(duplicateOutcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(duplicateOutcomeName);

    // Now try to create another outcome with the same name
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(duplicateOutcomeName);

    // Try to save - outcome should not be saved and error should be displayed
    await outcomesPage.clickSaveButton();
    
    // Verify outcome is not saved and there is an error displayed that outcome name cannot be duplicated
    await outcomesPage.verifyOutcomeNotSaved(duplicateOutcomeName);
  });

  test('verify drag and drop on outputs for a new outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Drag Drop';
    const originalOrder = ['Route to labs', 'Refer to UW', 'Offer'];
    const expectedNewOrder = ['Refer to UW', 'Route to labs', 'Offer']; // After dragging "Refer to UW" to first position

    // Open drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Add a name
    await outcomesPage.enterOutcomeName(outcomeName);

    // Get initial order of outputs
    const initialOrder = await outcomesPage.getOutputOrder();
    await outcomesPage.verifyOutputOrderIs(originalOrder);

    // Drag and drop to change the order - move "Refer to UW" to the first position
    await outcomesPage.dragAndDropOutput('Refer to UW', 'Route to labs');

    // Verify order of outputs is changed
    await outcomesPage.verifyOutputOrderChanged(originalOrder, expectedNewOrder);

    // Click save - outcome is saved in the list
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify outcome is saved in the list
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('verify view outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Viewing';

    // First, create an outcome to view
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Now test viewing the outcome
    // Click on the outcome name in the list
    await outcomesPage.clickOnOutcomeInList(outcomeName);

    // Verify drawer is opened
    await outcomesPage.verifyDrawerIsOpen();

    // Verify name is displayed
    await outcomesPage.verifyOutcomeNameDisplayedInDrawer(outcomeName);

    // Verify outputs are displayed
    await outcomesPage.verifyOutputsAreDisplayedInViewMode();

    // Verify edit button is present
    await outcomesPage.verifyEditButtonIsPresent();
  });

  test('verify edit outcome components', async ({ page }) => {
    const outcomeName = 'Test Outcome for Edit Components';

    // First, create an outcome to edit
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Test 1: Edit via view drawer
    // Click on the outcome name in the list to view it
    await outcomesPage.clickOnOutcomeInList(outcomeName);

    // Verify outcome drawer is opened with view components
    await outcomesPage.verifyDrawerIsOpen();
    await outcomesPage.verifyOutcomeNameDisplayedInDrawer(outcomeName);
    await outcomesPage.verifyOutputsAreDisplayedInViewMode();
    await outcomesPage.verifyEditButtonIsPresent();

    // Click on edit button
    await outcomesPage.clickEditButtonInDrawer();

    // Verify edit outcome components
    await outcomesPage.verifyEditOutcomeDrawerTitle(); // Name of drawer is "Edit Outcome"
    await outcomesPage.verifyOutcomeNameIsFilledInEditMode(outcomeName); // Outcome name is displayed and filled
    await outcomesPage.verifyOutputChoicesAreDisplayedInEditMode(); // Output choices are displayed
    await outcomesPage.verifyAddValueButtonInEditMode(); // Add value button is displayed
    await outcomesPage.verifySaveAndCancelButtonsInEditMode(); // Save and cancel buttons are displayed

    // Click cancel button - drawer is hidden
    await outcomesPage.clickCancelButtonInEditMode();
    await outcomesPage.verifyDrawerIsClosed();

    // Test 2: Edit via table action
    // Click edit action next to an outcome name in the list
    await outcomesPage.clickEditActionInTable(outcomeName);

    // Verify same components for edit outcome are displayed
    await outcomesPage.verifyEditOutcomeComponents(outcomeName);
  });

  test('add new output for an existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Adding Output';
    const newOutputValue = 'Additional Custom Output';

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Open the existing outcome for editing
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();

    // Verify we're in edit mode
    await outcomesPage.verifyEditOutcomeDrawerTitle();
    await outcomesPage.verifyOutputCount(3); // Initially 3 default outputs

    // Click on "Add value"
    await outcomesPage.clickAddValueButton();

    // Verify add value component is visible
    await outcomesPage.verifyAddValueComponentIsVisible();

    // Input a name for the new output value
    await outcomesPage.enterNewOutputValue(newOutputValue);

    // Verify confirm button is enabled
    await outcomesPage.verifyConfirmButtonEnabled();

    // Click confirm to add the new value
    await outcomesPage.clickAddValueConfirmButton();

    // Verify new value is shown in the outputs list
    await outcomesPage.verifyNewOutputValueInList(newOutputValue);

    // Verify we now have 4 outputs (3 original + 1 new)
    await outcomesPage.verifyOutputCount(4);

    // Save the updated outcome
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify the outcome is still in the list (updated)
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('verify edit output for an existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Editing Output';
    const originalOutputValue = 'Route to labs';
    const newOutputValue = 'Updated Route to Labs for Existing';

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Open the existing outcome for editing
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();

    // Verify we're in edit mode
    await outcomesPage.verifyEditOutcomeDrawerTitle();

    // Click on edit next to an output (Route to labs)
    await outcomesPage.clickEditButtonForOutput(originalOutputValue);

    // Verify edit component is visible
    await outcomesPage.verifyEditValueComponentIsVisible();

    // Change the name
    await outcomesPage.clearAndEnterEditValue(newOutputValue);

    // Click cancel - name is not changed
    await outcomesPage.clickEditValueCancelButton();
    await outcomesPage.verifyOutputValueUnchanged(originalOutputValue);
    await outcomesPage.verifyEditValueComponentIsHidden();

    // Edit again
    await outcomesPage.clickEditButtonForOutput(originalOutputValue);
    await outcomesPage.clearAndEnterEditValue(newOutputValue);

    // Now click confirm - name of output is changed
    await outcomesPage.clickEditValueConfirmButton();
    await outcomesPage.verifyOutputValueChanged(originalOutputValue, newOutputValue);

    // Save the updated outcome
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify the outcome is still in the list (updated)
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Optional: Verify the change persisted by reopening the outcome
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.verifyNewOutputValueInList(newOutputValue);
  });

  test('verify delete output for existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Deleting Output';
    const outputToDelete = 'Refer to UW';
    const remainingOutputs = ['Route to labs', 'Offer'];

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Open the existing outcome for editing
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();

    // Verify we're in edit mode
    await outcomesPage.verifyEditOutcomeDrawerTitle();

    // Verify initially there are 3 outputs
    await outcomesPage.verifyOutputCount(3);

    // Click on delete next to an output (Refer to UW)
    await outcomesPage.clickDeleteButtonForOutput(outputToDelete);

    // Verify the output is deleted
    await outcomesPage.verifyOutputValueDeleted(outputToDelete);

    // Check only 2 outputs are remaining after delete
    await outcomesPage.verifyOutputCount(2);

    // Verify the remaining outputs are correct
    await outcomesPage.verifyRemainingOutputs(remainingOutputs);

    // Save the updated outcome
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify the outcome is still in the list (updated)
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Optional: Verify the deletion persisted by reopening the outcome
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.verifyOutputCount(2);
    await outcomesPage.verifyRemainingOutputs(remainingOutputs);
  });

  test('verify drag and drop on outputs for an existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Drag Drop Existing';
    const originalOrder = ['Route to labs', 'Refer to UW', 'Offer'];
    const expectedNewOrder = ['Offer', 'Route to labs', 'Refer to UW']; // After dragging "Offer" to first position

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Open the existing outcome for editing
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();

    // Verify we're in edit mode
    await outcomesPage.verifyEditOutcomeDrawerTitle();

    // Verify initial order of outputs
    await outcomesPage.verifyOutputOrderIs(originalOrder);

    // Drag and drop to change the order - move "Offer" to the first position
    await outcomesPage.dragAndDropOutput('Offer', 'Route to labs');

    // Verify order of outputs is changed
    await outcomesPage.verifyOutputOrderChanged(originalOrder, expectedNewOrder);

    // Save the updated outcome
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();

    // Verify the outcome is still in the list (updated)
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Optional: Verify the order change persisted by reopening the outcome
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();
    await outcomesPage.verifyOutputOrderIs(expectedNewOrder);
  });

  test('verify minimum number of outputs is 2 on an existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Minimum Validation';
    const outputsToDelete = ['Route to labs', 'Refer to UW']; // Delete 2 to leave only 1 ("Offer")

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Open the existing outcome for editing
    await outcomesPage.clickOnOutcomeInList(outcomeName);
    await outcomesPage.clickEditButtonInDrawer();

    // Verify we're in edit mode with 3 initial outputs
    await outcomesPage.verifyEditOutcomeDrawerTitle();
    await outcomesPage.verifyOutputCount(3);

    // Delete outputs until there is only 1 remaining
    await outcomesPage.deleteMultipleOutputsUntilOne(outputsToDelete);

    // Verify only 1 output remains
    await outcomesPage.verifyOutputCount(1);

    // Verify minimum outputs error appears
    await outcomesPage.verifyMinimumOutputsError();

    // Try to save - should show validation alert
    await outcomesPage.attemptSaveWithValidationErrors();

    // Verify drawer is still open (save was prevented)
    await outcomesPage.verifyDrawerIsOpen();
  });

  test('verify minimum number of outputs is 2 on a new outcome', async ({ page }) => {
    const outcomeName = 'Test New Outcome for Minimum Validation';
    const outputsToDelete = ['Route to labs', 'Refer to UW']; // Delete 2 to leave only 1 ("Offer")

    // Open the create drawer
    await outcomesPage.clickCreateOutcomeButton();

    // Add a name for the outcome
    await outcomesPage.enterOutcomeName(outcomeName);

    // Verify initially there are 3 default outputs
    await outcomesPage.verifyOutputCount(3);

    // Delete outputs until there is only 1 remaining
    await outcomesPage.deleteMultipleOutputsUntilOne(outputsToDelete);

    // Verify only 1 output remains
    await outcomesPage.verifyOutputCount(1);

    // Verify minimum outputs error appears
    await outcomesPage.verifyMinimumOutputsError();

    // Try to save - should show validation alert
    await outcomesPage.attemptSaveWithValidationErrors();

    // Verify drawer is still open (save was prevented)
    await outcomesPage.verifyDrawerIsOpen();

    // Optional: Add another output to fix the validation error and verify save works
    await outcomesPage.clickAddValueButton();
    await outcomesPage.enterNewOutputValue('Fixed Output Choice');
    await outcomesPage.clickAddValueConfirmButton();

    // Verify we now have 2 outputs and error is gone
    await outcomesPage.verifyOutputCount(2);

    // Now save should work
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);
  });

  test('verify empty name of an existing outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Empty Name Validation';

    // First, create an outcome
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Click edit on the outcome
    await outcomesPage.clickEditActionInTable(outcomeName);

    // Verify we're in edit mode
    await outcomesPage.verifyEditOutcomeDrawerTitle();

    // Empty the name
    await outcomesPage.clearOutcomeName();

    // Click save - should show validation errors
    await outcomesPage.attemptSaveWithEmptyName();

    // Verify drawer is still open (save was prevented)
    await outcomesPage.verifyDrawerIsOpen();
  });

  test('verify delete outcome', async ({ page }) => {
    const outcomeName = 'Test Outcome for Deletion';

    // First, create an outcome to delete
    await outcomesPage.clickCreateOutcomeButton();
    await outcomesPage.enterOutcomeName(outcomeName);
    await outcomesPage.clickSaveButton();
    await outcomesPage.verifyDrawerIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Click on delete action next to the outcome in the list
    await outcomesPage.clickDeleteActionInTable(outcomeName);

    // Verify the popup appears with correct components
    await outcomesPage.verifyDeletePopupComponents();

    // Click cancel button - outcome should still be in the list
    await outcomesPage.clickDeletePopupCancelButton();
    await outcomesPage.verifyDeletePopupIsClosed();
    await outcomesPage.verifyNewOutcomeInTable(outcomeName);

    // Try delete again
    await outcomesPage.clickDeleteActionInTable(outcomeName);
    await outcomesPage.verifyDeletePopupComponents();

    // Click delete button - outcome should be deleted
    await outcomesPage.clickDeletePopupDeleteButton();
    await outcomesPage.verifyDeletePopupIsClosed();
    await outcomesPage.verifyOutcomeIsDeletedFromTable(outcomeName);
  });
});
