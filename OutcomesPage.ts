import { Page, Locator, expect } from '@playwright/test';

export class OutcomesPage {
  readonly page: Page;
  readonly calcElement: Locator;
  readonly titleElement: Locator;
  readonly outcomesTable: Locator;
  readonly createOutcomeButton: Locator;
  readonly tableHeaders: {
    outputType: Locator;
    outputChoice: Locator;
    dateCreated: Locator;
    updatedAt: Locator;
    actions: Locator;
  };
  
  // Drawer elements
  readonly drawer: Locator;
  readonly drawerContainer: Locator;
  readonly outcomeNameInput: Locator;
  readonly outputChoices: {
    routeToLabs: Locator;
    referToUW: Locator;
    offer: Locator;
  };
  readonly editButtons: Locator;
  readonly deleteButtons: Locator;
  readonly addButton: Locator;
  readonly cancelButton: Locator;
  readonly saveButton: Locator;
  
  // Add value component elements
  readonly addValueInputField: Locator;
  readonly addValueCancelButton: Locator;
  readonly addValueConfirmButton: Locator;
  readonly addValueComponent: Locator;
  
  // Edit value component elements
  readonly editValueInputField: Locator;
  readonly editValueCancelButton: Locator;
  readonly editValueConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calcElement = page.locator('calc.html');
    this.titleElement = page.locator('h1, title').first();
    this.outcomesTable = page.locator('table');
    this.createOutcomeButton = page.locator('button', { hasText: 'Create an Outcome' });
    
    // Table header locators
    this.tableHeaders = {
      outputType: page.locator('th', { hasText: 'Output type' }),
      outputChoice: page.locator('th', { hasText: 'Output choice' }),
      dateCreated: page.locator('th', { hasText: 'Date Created' }),
      updatedAt: page.locator('th', { hasText: 'Updated at' }),
      actions: page.locator('th', { hasText: 'Actions' })
    };

    // Drawer locators
    this.drawer = page.locator('[data-testid="opt-lib-drawer-content"]');
    this.drawerContainer = page.locator('._drawerContainer_suw3q_1');
    this.outcomeNameInput = page.locator('input[data-testid="opt-lib-input-field"]');
    
    // Output choices
    this.outputChoices = {
      routeToLabs: page.locator('[data-testid="opt-lib-typography"]', { hasText: 'Route to labs' }),
      referToUW: page.locator('[data-testid="opt-lib-typography"]', { hasText: 'Refer to UW' }),
      offer: page.locator('[data-testid="opt-lib-typography"]', { hasText: 'Offer' })
    };
    
    this.editButtons = page.locator('[data-testid="opt-lib-simple-list-item-edit-button"]');
    this.deleteButtons = page.locator('[data-testid="opt-lib-simple-list-item-delete-button"]');
    this.addButton = page.locator('button', { hasText: 'Add value' });
    this.cancelButton = page.locator('[data-testid="opt-lib-minimal-button"]', { hasText: 'Cancel' });
    this.saveButton = page.locator('[data-testid="opt-lib-button"]', { hasText: 'Save' });
    
    // Add value component locators
    this.addValueComponent = page.locator('.add-value-component, .add-value-form, [data-testid*="add-value"]').first();
    this.addValueInputField = page.locator('input[placeholder*="value"], input[data-testid*="add-value-input"]').last();
    this.addValueCancelButton = page.locator('button', { hasText: 'Cancel' }).last();
    this.addValueConfirmButton = page.locator('button', { hasText: /^(Confirm|Add|Save)$/i }).last();
    
    // Edit value component locators
    this.editValueInputField = page.locator('input[data-testid*="edit"], input[placeholder*="edit"]').last();
    this.editValueCancelButton = page.locator('button', { hasText: 'Cancel' }).last();
    this.editValueConfirmButton = page.locator('button', { hasText: /^(Confirm|Save|Update)$/i }).last();
  }

  async navigateToOutcomes() {
    await this.page.goto('/outcomes');
  }

  async verifyCalcElementPresent() {
    await expect(this.calcElement).toBeVisible();
  }

  async verifyTitle() {
    // Check if it's a page title or h1 element
    const pageTitle = await this.page.title();
    const h1Text = await this.page.locator('h1').first().textContent();
    
    const hasCorrectTitle = pageTitle === 'Outcomes' || h1Text === 'Outcomes';
    expect(hasCorrectTitle).toBeTruthy();
  }

  async verifyTableIsDisplayed() {
    await expect(this.outcomesTable).toBeVisible();
  }

  async verifyTableColumns() {
    await expect(this.tableHeaders.outputType).toBeVisible();
    await expect(this.tableHeaders.outputChoice).toBeVisible();
    await expect(this.tableHeaders.dateCreated).toBeVisible();
    await expect(this.tableHeaders.updatedAt).toBeVisible();
    await expect(this.tableHeaders.actions).toBeVisible();
  }

  async verifyCreateOutcomeButton() {
    await expect(this.createOutcomeButton).toBeVisible();
  }

  async clickCreateOutcomeButton() {
    await this.createOutcomeButton.click();
  }

  async verifyAllElements() {
    await this.verifyCalcElementPresent();
    await this.verifyTitle();
    await this.verifyTableIsDisplayed();
    await this.verifyTableColumns();
    await this.verifyCreateOutcomeButton();
  }

  // Drawer verification methods
  async verifyDrawerIsOpen() {
    await expect(this.drawer).toBeVisible();
    await expect(this.drawerContainer).toBeVisible();
  }

  async verifyCalcDrawerElement() {
    // Verify the drawer container with the specific class from calcDrawer.txt
    await expect(this.drawerContainer).toBeVisible();
  }

  async verifyOutcomeNameInput() {
    await expect(this.outcomeNameInput).toBeVisible();
    await expect(this.outcomeNameInput).toHaveValue('');
  }

  async verifyOutputChoices() {
    await expect(this.outputChoices.routeToLabs).toBeVisible();
    await expect(this.outputChoices.referToUW).toBeVisible();
    await expect(this.outputChoices.offer).toBeVisible();
  }

  async verifyEditAndDeleteButtons() {
    // Verify there are 3 edit buttons (one for each choice)
    await expect(this.editButtons).toHaveCount(3);
    await expect(this.deleteButtons).toHaveCount(3);
    
    // Verify all edit and delete buttons are visible
    for (let i = 0; i < 3; i++) {
      await expect(this.editButtons.nth(i)).toBeVisible();
      await expect(this.deleteButtons.nth(i)).toBeVisible();
    }
  }

  async verifyAddButton() {
    await expect(this.addButton).toBeVisible();
  }

  async verifyCancelAndSaveButtons() {
    await expect(this.cancelButton).toBeVisible();
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeDisabled();
  }

  async verifyAllDrawerElements() {
    await this.verifyDrawerIsOpen();
    await this.verifyCalcDrawerElement();
    await this.verifyOutcomeNameInput();
    await this.verifyOutputChoices();
    await this.verifyEditAndDeleteButtons();
    await this.verifyAddButton();
    await this.verifyCancelAndSaveButtons();
  }

  // Add value functionality methods
  async enterOutcomeName(name: string) {
    await this.outcomeNameInput.fill(name);
  }

  async clickAddValueButton() {
    await this.addButton.click();
  }

  async verifyAddValueComponentIsVisible() {
    await expect(this.addValueInputField).toBeVisible();
    await expect(this.addValueCancelButton).toBeVisible();
    await expect(this.addValueConfirmButton).toBeVisible();
    await expect(this.addValueConfirmButton).toBeDisabled();
  }

  async enterNewOutputValue(value: string) {
    await this.addValueInputField.fill(value);
  }

  async verifyConfirmButtonEnabled() {
    await expect(this.addValueConfirmButton).toBeEnabled();
  }

  async clickAddValueCancelButton() {
    await this.addValueCancelButton.click();
  }

  async verifyAddValueComponentIsHidden() {
    await expect(this.addValueInputField).not.toBeVisible();
  }

  async clickAddValueConfirmButton() {
    await this.addValueConfirmButton.click();
  }

  async verifyNewOutputValueInList(value: string) {
    const newOutputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: value });
    await expect(newOutputChoice).toBeVisible();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async verifyDrawerIsClosed() {
    await expect(this.drawer).not.toBeVisible();
  }

  async verifyNewOutcomeInTable(outcomeName: string) {
    const outcomeInTable = this.page.locator('td', { hasText: outcomeName });
    await expect(outcomeInTable).toBeVisible();
  }

  // Edit value functionality methods
  async clickEditButtonForOutput(outputText: string) {
    // Find the specific output choice and click its edit button
    const outputRow = this.page.locator('[data-testid="opt-lib-simple-list-item"]', { 
      has: this.page.locator('[data-testid="opt-lib-typography"]', { hasText: outputText }) 
    });
    const editButton = outputRow.locator('[data-testid="opt-lib-simple-list-item-edit-button"]');
    await editButton.click();
  }

  async verifyEditValueComponentIsVisible() {
    await expect(this.editValueInputField).toBeVisible();
    await expect(this.editValueCancelButton).toBeVisible();
    await expect(this.editValueConfirmButton).toBeVisible();
  }

  async getEditValueInputValue() {
    return await this.editValueInputField.inputValue();
  }

  async clearAndEnterEditValue(newValue: string) {
    await this.editValueInputField.clear();
    await this.editValueInputField.fill(newValue);
  }

  async clickEditValueCancelButton() {
    await this.editValueCancelButton.click();
  }

  async verifyOutputValueUnchanged(originalValue: string) {
    const outputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: originalValue });
    await expect(outputChoice).toBeVisible();
  }

  async verifyEditValueComponentIsHidden() {
    await expect(this.editValueInputField).not.toBeVisible();
  }

  async clickEditValueConfirmButton() {
    await this.editValueConfirmButton.click();
  }

  async verifyOutputValueChanged(oldValue: string, newValue: string) {
    // Verify old value is not visible
    const oldOutputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: oldValue });
    await expect(oldOutputChoice).not.toBeVisible();
    
    // Verify new value is visible
    const newOutputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: newValue });
    await expect(newOutputChoice).toBeVisible();
  }

  // Delete value functionality methods
  async clickDeleteButtonForOutput(outputText: string) {
    // Find the specific output choice and click its delete button
    const outputRow = this.page.locator('[data-testid="opt-lib-simple-list-item"]', { 
      has: this.page.locator('[data-testid="opt-lib-typography"]', { hasText: outputText }) 
    });
    const deleteButton = outputRow.locator('[data-testid="opt-lib-simple-list-item-delete-button"]');
    await deleteButton.click();
  }

  async verifyOutputValueDeleted(deletedValue: string) {
    // Verify deleted value is no longer visible
    const deletedOutputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: deletedValue });
    await expect(deletedOutputChoice).not.toBeVisible();
  }

  async verifyOutputCount(expectedCount: number) {
    // Count the number of output choices displayed
    const outputChoices = this.page.locator('[data-testid="opt-lib-simple-list-item"]');
    await expect(outputChoices).toHaveCount(expectedCount);
  }

  async verifyRemainingOutputs(remainingOutputs: string[]) {
    // Verify that only the expected outputs remain
    for (const outputText of remainingOutputs) {
      const outputChoice = this.page.locator('[data-testid="opt-lib-typography"]', { hasText: outputText });
      await expect(outputChoice).toBeVisible();
    }
  }

  // Duplicate name validation methods
  async getExistingOutcomeNames(): Promise<string[]> {
    // Get all existing outcome names from the table
    const outcomeNameCells = this.page.locator('td').filter({ hasText: /^(?!.*Actions).*$/ }); // Exclude Actions column
    const names: string[] = [];
    const count = await outcomeNameCells.count();
    
    for (let i = 0; i < count; i++) {
      const text = await outcomeNameCells.nth(i).textContent();
      if (text && text.trim() && !text.includes('Actions')) {
        names.push(text.trim());
      }
    }
    return names;
  }

  async verifyDuplicateNameError() {
    // Look for error message indicating duplicate name
    const errorMessages = [
      this.page.locator('.error-message', { hasText: /duplicate/i }),
      this.page.locator('.error-message', { hasText: /already exists/i }),
      this.page.locator('[data-testid*="error"]', { hasText: /duplicate/i }),
      this.page.locator('.validation-error', { hasText: /duplicate/i }),
      this.page.locator('*', { hasText: /outcome.*name.*cannot.*be.*duplicated/i }),
      this.page.locator('*', { hasText: /name.*already.*exists/i })
    ];

    let errorFound = false;
    for (const errorLocator of errorMessages) {
      try {
        await expect(errorLocator).toBeVisible({ timeout: 2000 });
        errorFound = true;
        break;
      } catch {
        // Continue checking other error message patterns
      }
    }
    
    expect(errorFound).toBeTruthy();
  }

  async verifySaveButtonStillDisabled() {
    await expect(this.saveButton).toBeDisabled();
  }

  async verifyOutcomeNotSaved(duplicateName: string) {
    // Verify the drawer is still open (outcome wasn't saved)
    await expect(this.drawer).toBeVisible();
    
    // Verify the duplicate name error prevents saving
    await this.verifyDuplicateNameError();
    await this.verifySaveButtonStillDisabled();
  }

  // Drag and drop functionality methods
  async getOutputOrder(): Promise<string[]> {
    // Get the current order of outputs by reading the text of each output choice
    const outputItems = this.page.locator('[data-testid="opt-lib-simple-list-item"]');
    const outputTexts: string[] = [];
    const count = await outputItems.count();
    
    for (let i = 0; i < count; i++) {
      const textElement = outputItems.nth(i).locator('[data-testid="opt-lib-typography"]');
      const text = await textElement.textContent();
      if (text) {
        outputTexts.push(text.trim());
      }
    }
    return outputTexts;
  }

  async dragAndDropOutput(sourceOutputText: string, targetOutputText: string) {
    // Find the source and target output elements
    const sourceItem = this.page.locator('[data-testid="opt-lib-simple-list-item"]', {
      has: this.page.locator('[data-testid="opt-lib-typography"]', { hasText: sourceOutputText })
    });
    const targetItem = this.page.locator('[data-testid="opt-lib-simple-list-item"]', {
      has: this.page.locator('[data-testid="opt-lib-typography"]', { hasText: targetOutputText })
    });

    // Get the drag handle for the source item
    const sourceDragHandle = sourceItem.locator('[data-testid="opt-lib-simple-list-item-drag-icon"]');
    
    // Perform drag and drop operation
    await sourceDragHandle.dragTo(targetItem);
  }

  async verifyOutputOrderChanged(originalOrder: string[], expectedNewOrder: string[]) {
    // Get the current order after drag and drop
    const currentOrder = await this.getOutputOrder();
    
    // Verify the order has changed from the original
    expect(currentOrder).not.toEqual(originalOrder);
    
    // Verify the new order matches expectations
    expect(currentOrder).toEqual(expectedNewOrder);
  }

  async verifyOutputOrderIs(expectedOrder: string[]) {
    const currentOrder = await this.getOutputOrder();
    expect(currentOrder).toEqual(expectedOrder);
  }

  // View outcome functionality methods
  async clickOnOutcomeInList(outcomeName: string) {
    // Click on the outcome name in the table to open it for viewing
    const outcomeNameCell = this.page.locator('td', { hasText: outcomeName });
    await outcomeNameCell.click();
  }

  async verifyOutcomeNameDisplayedInDrawer(expectedName: string) {
    // Verify the outcome name is displayed in the drawer (could be in title or input field)
    const nameInInput = await this.outcomeNameInput.inputValue();
    const drawerTitle = await this.page.locator('[data-testid="opt-lib-drawer-title"]').textContent();
    
    const nameDisplayed = nameInInput === expectedName || (drawerTitle && drawerTitle.includes(expectedName));
    expect(nameDisplayed).toBeTruthy();
  }

  async verifyOutputsAreDisplayedInViewMode() {
    // Verify the output choices are displayed when viewing an outcome
    await this.verifyOutputChoices();
  }

  async verifyEditButtonIsPresent() {
    // Look for an edit button in the drawer (could be at top level or for the outcome)
    const editButtons = [
      this.page.locator('button', { hasText: /^Edit$/i }),
      this.page.locator('button', { hasText: 'Edit Outcome' }),
      this.page.locator('[data-testid*="edit-button"]'),
      this.page.locator('.edit-button'),
      this.editButtons.first() // Individual output edit buttons
    ];

    let editButtonFound = false;
    for (const editButton of editButtons) {
      try {
        await expect(editButton).toBeVisible({ timeout: 2000 });
        editButtonFound = true;
        break;
      } catch {
        // Continue checking other edit button patterns
      }
    }
    
    expect(editButtonFound).toBeTruthy();
  }

  async verifyViewOutcomeDrawer(outcomeName: string) {
    // Comprehensive verification for viewing an outcome
    await this.verifyDrawerIsOpen();
    await this.verifyOutcomeNameDisplayedInDrawer(outcomeName);
    await this.verifyOutputsAreDisplayedInViewMode();
    await this.verifyEditButtonIsPresent();
  }

  // Edit outcome functionality methods
  async clickEditButtonInDrawer() {
    // Click the main edit button in the drawer (not individual output edit buttons)
    const mainEditButton = this.page.locator('button', { hasText: /^Edit$/i }).first();
    await mainEditButton.click();
  }

  async verifyEditOutcomeDrawerTitle() {
    // Verify the drawer title shows "Edit Outcome"
    const drawerTitle = this.page.locator('[data-testid="opt-lib-drawer-title"]');
    await expect(drawerTitle).toContainText('Edit Outcome');
  }

  async verifyOutcomeNameIsFilledInEditMode(expectedName: string) {
    // Verify the outcome name input is filled with the existing name
    await expect(this.outcomeNameInput).toHaveValue(expectedName);
  }

  async verifyOutputChoicesAreDisplayedInEditMode() {
    // Verify output choices are displayed in edit mode (same as view mode)
    await this.verifyOutputChoices();
  }

  async verifyAddValueButtonInEditMode() {
    // Verify add value button is present in edit mode
    await expect(this.addButton).toBeVisible();
  }

  async verifySaveAndCancelButtonsInEditMode() {
    // Verify both save and cancel buttons are present in edit mode
    await expect(this.saveButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async clickCancelButtonInEditMode() {
    // Click the cancel button in edit mode
    await this.cancelButton.click();
  }

  async clickEditActionInTable(outcomeName: string) {
    // Click the edit action button next to an outcome in the table
    const outcomeRow = this.page.locator('tr', {
      has: this.page.locator('td', { hasText: outcomeName })
    });
    const editActionButton = outcomeRow.locator('button', { hasText: /edit/i }).or(
      outcomeRow.locator('[data-testid*="edit"]')
    ).or(
      outcomeRow.locator('.edit-action')
    );
    await editActionButton.click();
  }

  async verifyEditOutcomeComponents(outcomeName: string) {
    // Comprehensive verification for edit outcome mode
    await this.verifyDrawerIsOpen();
    await this.verifyEditOutcomeDrawerTitle();
    await this.verifyOutcomeNameIsFilledInEditMode(outcomeName);
    await this.verifyOutputChoicesAreDisplayedInEditMode();
    await this.verifyAddValueButtonInEditMode();
    await this.verifySaveAndCancelButtonsInEditMode();
  }

  // Minimum outputs validation methods
  async verifyMinimumOutputsError() {
    // Verify the error message for minimum outputs requirement
    const errorElement = this.page.locator('[data-testid="opt-lib-draggable-list-items-error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('A urle set need at least 2 output choices. Add another choice.');
  }

  async verifySaveValidationAlert() {
    // Verify the alert box that appears when trying to save with validation errors
    const alertElement = this.page.locator('[data-testid="alert-box-outcome-actions"]');
    await expect(alertElement).toBeVisible();
    await expect(alertElement).toContainText('THere are some issues to fix before you can save this outcome. See above.');
  }

  async deleteMultipleOutputsUntilOne(outputsToDelete: string[]) {
    // Delete multiple outputs in sequence until only one remains
    for (const outputToDelete of outputsToDelete) {
      await this.clickDeleteButtonForOutput(outputToDelete);
      await this.verifyOutputValueDeleted(outputToDelete);
    }
  }

  async verifyMinimumOutputsValidation() {
    // Comprehensive verification for minimum outputs validation
    await this.verifyMinimumOutputsError();
  }

  async attemptSaveWithValidationErrors() {
    // Try to save when there are validation errors
    await this.clickSaveButton();
    await this.verifySaveValidationAlert();
  }

  // Empty name validation methods
  async clearOutcomeName() {
    // Clear the outcome name input field
    await this.outcomeNameInput.clear();
  }

  async verifyEmptyNameFieldError() {
    // Verify the field-level error for empty required name
    const errorWrapper = this.page.locator('.error-wrapper');
    const errorIcon = errorWrapper.locator('[data-testid="opt-lib-icon"]');
    const errorMessage = errorWrapper.locator('p.error-message');
    
    await expect(errorWrapper).toBeVisible();
    await expect(errorIcon).toBeVisible();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('This is required');
  }

  async verifyEmptyNameValidation() {
    // Comprehensive verification for empty name validation
    await this.verifyEmptyNameFieldError();
    await this.verifySaveValidationAlert();
  }

  async attemptSaveWithEmptyName() {
    // Try to save when name is empty
    await this.clickSaveButton();
    await this.verifyEmptyNameValidation();
  }

  // Delete outcome functionality methods
  async clickDeleteActionInTable(outcomeName: string) {
    // Click the delete action button next to an outcome in the table
    const outcomeRow = this.page.locator('tr', {
      has: this.page.locator('td', { hasText: outcomeName })
    });
    const deleteActionButton = outcomeRow.locator('button', { hasText: /delete/i }).or(
      outcomeRow.locator('[data-testid*="delete"]')
    ).or(
      outcomeRow.locator('.delete-action')
    );
    await deleteActionButton.click();
  }

  async verifyDeletePopupIsVisible() {
    // Verify the delete popup/modal is displayed
    const deleteModal = this.page.locator('._modalContainer_7yuui_14');
    await expect(deleteModal).toBeVisible();
  }

  async verifyDeletePopupTitle() {
    // Verify the popup title is "Delete outcome"
    const deleteTitle = this.page.locator('[data-testid="dialog-delete-outcome-title"]');
    await expect(deleteTitle).toContainText('Delete outcome');
  }

  async verifyDeletePopupMessage() {
    // Verify the confirmation message
    const deleteMessage = this.page.locator('[data-testid="dialog-delete-outcome-content"]');
    await expect(deleteMessage).toContainText('Are you sure you want to delete this outcome?');
  }

  async verifyDeletePopupButtons() {
    // Verify delete and cancel buttons are present
    const deleteButton = this.page.locator('[data-testid="dialog-delete-outcome-action-primary"]');
    const cancelButton = this.page.locator('[data-testid="dialog-delete-outcome-action-cancel"]');
    
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toContainText('Delete');
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toContainText('Cancel');
  }

  async clickDeletePopupCancelButton() {
    // Click the cancel button in the delete popup
    const cancelButton = this.page.locator('[data-testid="dialog-delete-outcome-action-cancel"]');
    await cancelButton.click();
  }

  async clickDeletePopupDeleteButton() {
    // Click the delete button in the delete popup
    const deleteButton = this.page.locator('[data-testid="dialog-delete-outcome-action-primary"]');
    await deleteButton.click();
  }

  async verifyDeletePopupIsClosed() {
    // Verify the delete popup is no longer visible
    const deleteModal = this.page.locator('._modalContainer_7yuui_14');
    await expect(deleteModal).not.toBeVisible();
  }

  async verifyOutcomeIsDeletedFromTable(outcomeName: string) {
    // Verify the outcome is no longer in the table
    const outcomeInTable = this.page.locator('td', { hasText: outcomeName });
    await expect(outcomeInTable).not.toBeVisible();
  }

  async verifyDeletePopupComponents() {
    // Comprehensive verification for delete popup
    await this.verifyDeletePopupIsVisible();
    await this.verifyDeletePopupTitle();
    await this.verifyDeletePopupMessage();
    await this.verifyDeletePopupButtons();
  }
}
