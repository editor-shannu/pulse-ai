describe('PulseAI Core Flows', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/');
  });

  it('1. User onboarding form submission & 2. Plan generation success', () => {
    cy.get('input[name="age"]').type('25');
    cy.get('input[name="weight"]').type('75');
    cy.get('input[name="height"]').type('175');
    cy.get('select[name="goal"]').select('Fat Loss');
    
    // Submit form
    cy.get('[data-testid="submit-onboarding"]').click();

    // Verify redirect to Dashboard and plan generation success
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard');
    cy.contains('Fat Loss');
    cy.contains('Plan Intensity');
    cy.contains('Today\'s Workout');
    cy.contains('Diet Overview');
  });

  it('3. Feedback buttons updating plan (Adaptive Feature)', () => {
    // Fill the onboarding first
    cy.get('input[name="age"]').type('25');
    cy.get('input[name="weight"]').type('75');
    cy.get('input[name="height"]').type('175');
    cy.get('[data-testid="submit-onboarding"]').click();
    
    cy.url().should('include', '/dashboard');
    
    // Check initial intensity
    cy.contains('Medium'); // Default intensity

    // Click 'Too Hard' and assert intensity reduced
    cy.get('[data-testid="btn-too-hard"]').click();
    cy.contains('Low'); // Intensity lowers
    
    // Click 'Too Easy' and assert intensity increased
    cy.get('[data-testid="btn-too-easy"]').click();
    cy.contains('High'); // Intensity increases back
  });

  it('4. File upload functionality (Analyzer)', () => {
    // Onboard user
    cy.get('input[name="age"]').type('25');
    cy.get('input[name="weight"]').type('75');
    cy.get('input[name="height"]').type('175');
    cy.get('[data-testid="submit-onboarding"]').click();

    // Go to upload page
    cy.contains('Upload Plan').click();

    cy.contains('Workout Plan Analyzer');
    cy.get('input[type="file"]').should('exist');
    
    // We cannot easily mock a real file without full fixture in Cypress just for UI, 
    // but we can verify the extraction triggers by simulating the button behavior if we had a file 
    // Usually 'cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')'
    // For this prototype, we'll write an empty test file, select it, and click analyse.

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('dummy file content'),
      fileName: 'workout_plan.pdf',
      mimeType: 'application/pdf',
    });

    cy.contains('Extract & Analyze').click();
    
    // Wait for the simulated AI (2 seconds)
    cy.contains('Analyzing...', { timeout: 4000 });
    cy.contains('Plan Summary', { timeout: 4000 });
    cy.contains('Issues Detected');
    cy.contains('Improved Suggestion');
  });

  it('5. Chatbot input/output', () => {
    // Onboard user
    cy.get('input[name="age"]').type('25');
    cy.get('input[name="weight"]').type('75');
    cy.get('input[name="height"]').type('175');
    cy.get('[data-testid="submit-onboarding"]').click();

    // Go to Chat page
    cy.contains('Ask AI').click();
    cy.contains('PulseAI Chat');

    // Type a message
    cy.get('[data-testid="chat-input"]').type('What diet should I follow?');
    cy.get('[data-testid="send-message"]').click();

    // Ensure our message appears
    cy.contains('What diet should I follow?');

    // Wait for AI response simulation
    cy.contains('I suggest prioritizing local seasonal vegetables', { timeout: 4000 });
  });
});
