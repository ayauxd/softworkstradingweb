import readline from 'readline';
import fetch from 'node-fetch';

// Create interactive interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

async function sendMessage(message) {
  try {
    const response = await fetch('http://localhost:5002/api/simulate-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${colors.fg.red}Error sending message:${colors.reset}`, error);
    return {
      text: "Sorry, I'm having trouble connecting to the knowledge base. Please try again.",
      success: false
    };
  }
}

async function startChat() {
  console.log(`${colors.bright}${colors.fg.cyan}Welcome to the Softworks Trading Company AI Assistant${colors.reset}`);
  console.log(`${colors.fg.yellow}Type your message and press Enter to chat. Type 'exit' to quit.${colors.reset}`);
  console.log('-'.repeat(70));
  
  const promptUser = () => {
    rl.question(`${colors.bright}${colors.fg.green}You:${colors.reset} `, async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log(`${colors.fg.cyan}Thank you for chatting with Softworks Trading Company AI Assistant. Goodbye!${colors.reset}`);
        rl.close();
        return;
      }
      
      console.log(`${colors.dim}Thinking...${colors.reset}`);
      const response = await sendMessage(input);
      
      console.log(`${colors.bright}${colors.fg.blue}Assistant:${colors.reset} ${response.text}`);
      if (response.source) {
        console.log(`${colors.dim}(Source: ${response.source})${colors.reset}`);
      }
      console.log('-'.repeat(70));
      
      promptUser();
    });
  };
  
  promptUser();
}

// Start the chat
startChat().catch(error => {
  console.error(`${colors.fg.red}Fatal error:${colors.reset}`, error);
  rl.close();
});