/**
 * @jest-environment puppeteer
 */

const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

// Selectors for testing
const SELECTORS = {
  // Main modal
  openModalButton: '[aria-label="Chat with a workflow agent"]',
  modal: '[aria-describedby="workflow-agent-description"]',
  modalTitle: 'h2',
  
  // Interaction modes
  chatButton: 'button[aria-label="Chat with a workflow agent"]',
  callButton: 'button[aria-label="Call a workflow agent"]',
  
  // Chat interface
  chatInput: 'input[aria-label="Chat message"]',
  sendButton: 'button[aria-label="Send message"]',
  chatMessages: '[role="log"]',
  clearHistoryButton: 'button[aria-label="Clear chat history"]',
  
  // Call interface
  endCallButton: 'button[aria-label="End call"]',
  callStatus: 'h3',
  
  // Callback form
  callbackForm: 'form',
  nameInput: 'input#fullName',
  emailInput: 'input#workEmail',
  messageTextarea: 'textarea#callbackMessage',
  submitButton: 'button[type="submit"]'
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('WorkflowAgentModal Component', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Set viewport size to desktop
    await page.setViewport({
      width: 1280,
      height: 800
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  });

  test('Modal can be opened by clicking the chat button', async () => {
    // Find and click the button that opens the modal
    const openModalButton = await page.waitForSelector(SELECTORS.openModalButton);
    await openModalButton.click();
    
    // Check if the modal is visible
    const modal = await page.waitForSelector(SELECTORS.modal, { visible: true });
    expect(modal).toBeTruthy();
    
    // Check the modal title
    const modalTitle = await page.$eval(SELECTORS.modalTitle, el => el.textContent);
    expect(modalTitle).toContain('Talk to a Workflow Agent');
  });

  test('User can enter chat mode and send a message', async () => {
    // Open the modal
    const openModalButton = await page.waitForSelector(SELECTORS.openModalButton);
    await openModalButton.click();
    
    // Click the chat button
    const chatButton = await page.waitForSelector(SELECTORS.chatButton);
    await chatButton.click();
    
    // Wait for chat interface to appear
    await page.waitForSelector(SELECTORS.chatInput);
    
    // Type and send a message
    await page.type(SELECTORS.chatInput, 'Hello, AI assistant!');
    await page.click(SELECTORS.sendButton);
    
    // Wait for response (allowing time for the AI to respond)
    await delay(2000);
    
    // Check that user message appears in chat
    const chatContent = await page.$eval(SELECTORS.chatMessages, el => el.textContent);
    expect(chatContent).toContain('Hello, AI assistant!');
    
    // Check that an agent response was received
    const messageCount = await page.$$eval(`${SELECTORS.chatMessages} > div`, msgs => msgs.length);
    expect(messageCount).toBeGreaterThan(1);
  });

  test('Chat history can be cleared', async () => {
    // Open the modal
    const openModalButton = await page.waitForSelector(SELECTORS.openModalButton);
    await openModalButton.click();
    
    // Click the chat button
    const chatButton = await page.waitForSelector(SELECTORS.chatButton);
    await chatButton.click();
    
    // Wait for chat interface to appear
    await page.waitForSelector(SELECTORS.chatInput);
    
    // Type and send a message
    await page.type(SELECTORS.chatInput, 'This message will be cleared');
    await page.click(SELECTORS.sendButton);
    
    // Wait for response
    await delay(2000);
    
    // Get message count before clearing
    const beforeClearCount = await page.$$eval(`${SELECTORS.chatMessages} > div`, msgs => msgs.length);
    
    // Click clear history button
    const clearButton = await page.waitForSelector(SELECTORS.clearHistoryButton);
    await clearButton.click();
    
    // Wait for clear operation to complete
    await delay(500);
    
    // Get message count after clearing
    const afterClearCount = await page.$$eval(`${SELECTORS.chatMessages} > div`, msgs => msgs.length);
    
    // Should only have the welcome message left
    expect(afterClearCount).toBeLessThan(beforeClearCount);
    expect(afterClearCount).toBe(1);
  });

  test('User can start a voice call', async () => {
    // Open the modal
    const openModalButton = await page.waitForSelector(SELECTORS.openModalButton);
    await openModalButton.click();
    
    // Click the call button
    const callButton = await page.waitForSelector(SELECTORS.callButton);
    await callButton.click();
    
    // Wait for connecting animation (2 seconds)
    await delay(3000);
    
    // Check that call interface is active
    const callStatus = await page.$eval(SELECTORS.callStatus, el => el.textContent);
    expect(callStatus).toContain('Voice Call in Progress');
    
    // End the call
    const endCallButton = await page.waitForSelector(SELECTORS.endCallButton);
    await endCallButton.click();
    
    // Wait for processing
    await delay(1000);
  });
});