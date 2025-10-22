# Google Sheets Integration Setup Guide

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Anantasutra Contact Form Submissions"
4. Create the following columns in row 1:
   - A: Timestamp
   - B: Name
   - C: Email
   - D: Company
   - E: Project Type
   - F: Budget
   - G: Timeline
   - H: Message
   - I: Status
   - J: Source

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to Extensions > Apps Script
2. Delete the default code and paste the following:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Add the data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.company,
      data.projectType,
      data.budget,
      data.timeline,
      data.message,
      data.status,
      data.source
    ]);
    
    // Send confirmation email (optional)
    const subject = `New Contact Form Submission - ${data.name}`;
    const body = `
      New contact form submission received:
      
      Name: ${data.name}
      Email: ${data.email}
      Company: ${data.company}
      Project Type: ${data.projectType}
      Budget: ${data.budget}
      Timeline: ${data.timeline}
      Message: ${data.message}
      
      Timestamp: ${data.timestamp}
    `;
    
    // Send email to appropriate address based on project type
    let recipientEmail = 'contact@anantasutra.com'; // Default
    
    if (data.projectType === 'consulting' || data.budget === 'over-100k') {
      recipientEmail = 'co-founder@anantasutra.com';
    } else if (data.projectType === 'web-development' || data.projectType === 'mobile-app') {
      recipientEmail = 'support@anantasutra.com';
    }
    
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: body
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the web app URL

## Step 4: Configure Environment Variables
Add the following to your `.env.local` file:

```
NEXT_PUBLIC_GOOGLE_SHEETS_URL=your_web_app_url_here
```

**Note**: Use `NEXT_PUBLIC_` prefix so the environment variable is available on the client side.

## Step 5: Test the Integration
1. Fill out the contact form on your website
2. Check your Google Sheet
2. Check that the appropriate email was sent to the right address

## Email Routing Logic
- **co-founder@anantasutra.com**: Consulting projects or high-budget projects (>$100k)
- **support@anantasutra.com**: Web development and mobile app projects
- **contact@anantasutra.com**: All other inquiries (default)

## Security Notes
- The Google Apps Script will handle form validation
- Emails are sent automatically based on project type
- All submissions are logged in the Google Sheet
- You can set up additional automation in Google Sheets for follow-up workflows
