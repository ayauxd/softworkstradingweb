# Voice Call Features

This document describes the voice call features of the Softworks Trading Company workflow agent.

## Overview

The voice call feature provides a simulated conversation with an AI workflow agent, allowing users to discuss their business automation needs in a conversational format. The call has several key features:

1. **Time-Limited Call**: Each call is limited to 3 minutes to keep conversations focused
2. **Time Notifications**: Users receive automatic notifications when time is running out
3. **Automatic Summary**: The system generates a summary of the conversation
4. **Consultation Summary Form**: Users can review the summary and provide contact information

## Call Flow

The voice call follows this sequence:

1. **Call Initiation**:
   - User clicks "Call an Agent" in the workflow agent modal
   - System shows a "Connecting..." animation for 2 seconds
   - Call begins with a welcome message from the AI agent

2. **During Call**:
   - AI responds to user questions in a conversational manner
   - Call timer shows remaining time in the top-right corner
   - Messages are displayed in the conversation area

3. **Time Notifications**:
   - At 1 minute remaining (60 seconds): Visual and audio notification
   - At 10 seconds remaining: Final warning with notification that a summary is being prepared
   - System begins generating the consultation summary in the background

4. **Call Completion**:
   - Call automatically ends when the timer reaches zero
   - Alternatively, user can end the call manually by clicking "End Call"
   - System completes the summary generation if not already done

5. **Consultation Summary**:
   - Summary is displayed with key points from the conversation
   - User can review the summary and copy it to clipboard
   - Contact form captures user information for follow-up
   - User submits form to receive a confirmation email with the summary

## User Interface Elements

### Timer Display

- Regular state: Gray timestamp showing minutes:seconds
- Warning state (1 minute remaining): Yellow background with clock icon
- Critical state (10 seconds remaining): Red pulsing background

### Time Notifications

- **1-Minute Warning**:
  - Yellow alert banner appears below the call information
  - Voice announcement: "You have 1 minute remaining in this call"

- **10-Second Warning**:
  - Red alert banner indicates the call will end soon
  - Voice announcement: "We have 10 seconds left. I've drafted a summary of our conversation for your review"

### Consultation Summary Screen

The consultation summary screen has these components:

1. **Summary Section**:
   - Displays an AI-generated summary of the conversation
   - Includes key points discussed, potential solutions, and recommended next steps
   - Copy button allows users to save the summary to clipboard

2. **Contact Form**:
   - Required fields: Full Name, Email Address
   - Optional fields: Company Name, Phone Number, Additional Notes
   - Submit button sends the information and consultation summary

3. **Navigation**:
   - Back button returns to the call (if time remains)
   - Submit button sends the summary and ends the session

## Technical Implementation

The voice call feature is implemented with these key components:

- `VoiceCallInterface.tsx`: Main component for the voice call UI
- `ConsultationSummary.tsx`: Component for the summary and contact form
- `aiService.ts`: Handles API calls for voice generation and summary handling

### Call Timer Implementation

The call timer uses React's `useEffect` and `useState` hooks:

```tsx
// Start a 3-minute countdown timer
const startCallTimer = useCallback(() => {
  const timerInterval = setInterval(() => {
    setCallTimeRemaining(prev => {
      // Check for time thresholds and trigger notifications
      if (prev === 60) {
        setShowTimeWarning(true);
        // Display and announce 1-minute warning
      }
      
      if (prev === 10) {
        setTimeCritical(true);
        // Display and announce 10-second warning
        // Begin generating summary in background
      }
      
      // End call when time is up
      if (prev <= 1) {
        clearInterval(timerInterval);
        handleEndCall();
        return 0;
      }
      
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(timerInterval);
}, []);
```

### Summary Generation

The summary is generated either:

1. In the background during the last 10 seconds of the call, or
2. After the call ends if not already generated

The summary prompt instructs the AI to provide:
- Key points discussed
- Potential solutions
- Recommended next steps

## Future Enhancements

Potential improvements for future versions:

1. **Real-time transcription**: Show a live transcript of the conversation
2. **Extended call option**: Allow users to extend calls beyond the 3-minute limit
3. **Call recording**: Option to record the call for later reference
4. **Multi-party calls**: Enable calls with multiple AI specialists
5. **Screen sharing**: Allow users to share their screen during the call
6. **Calendar integration**: Direct booking of follow-up appointments

## Testing Guide

To test the call timer notifications:

1. Modify the `callTimeRemaining` initial value for testing:
   - Set to `70` to test the 1-minute warning
   - Set to `15` to test the 10-second warning
   - Set to `0` to skip directly to the consultation summary

2. Verify each state:
   - Confirm timer display changes color
   - Verify warning banners appear
   - Check that the summary is generated correctly