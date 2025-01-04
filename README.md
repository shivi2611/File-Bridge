# FileBridge - File Sharing tool

## Overview
This project is a peer-to-peer file-sharing application built using the MERN stack (MongoDB, Express, React, Node.js). It leverages WebRTC and WebSocket technologies to enable real-time file sharing between users without the need for server-side file storage. The app is designed to be lightweight and efficient, ensuring a seamless user experience.

## Features

- **Instant Peer-to-Peer File Sharing**: Enables seamless file transfers directly between peers using WebRTC.
- **No File Type Restrictions**: The tool supports any file type, leveraging the WebRTC Data Channel for unrestricted file sharing.
- **Private and Secure**: Files are not stored on a server, ensuring a fully private transfer experience.
- **Easy Sharing**: Generates unique, shareable links for quick access to sessions.
- **Real-Time Communication**: Uses WebRTC and WebSocket technologies for instant connection establishment.

- 
## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.
- **Real-Time Communication**: WebRTC, Socket.io

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd file-sharing-tool
   ```
3. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```
4. Create a `.env` file in the root directory and add the following:
   ```env
   process.env.CLIENT_URL = http://localhost:5173/
   HTTP_PORT = 3000
   ```
5. Start the backend server:
   ```bash
   cd backend
   nodemon index.js
   ```
6. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## How It Works
1. **File Upload**:
   - A user selects a file from their system and clicks on generate link button.
2. **Link Generation**:
   - The backend creates a session and generates a unique link that includes a session ID.
3. **File Sharing**:
   - When the receiver clicks the link, they join a WebSocket room associated with the session.
   - WebRTC establishes a direct peer-to-peer connection for file transfer.
   - file sharing via WebRTC takes place.
     
### Screenshots
- **File Upload Page**:
   ![image](https://github.com/user-attachments/assets/6a280c49-bdbb-40aa-bbac-1780869407a3)
- **Generated Link**:
  ![image](https://github.com/user-attachments/assets/2adac93e-5b5d-4eb7-82ad-ea96a9cd8395)
- **Download File**:
  ![image](https://github.com/user-attachments/assets/bb18f300-ed3e-490e-8b3b-70b61fd03cd8)

## Future Enhancements
- Deploy the application to a cloud platform for public access.
- Implement additional security features like encrypted file transfer.
- Include a file download progress diaplay bar.

## Contact
For any queries or collaboration opportunities, feel free to reach out:
- **Email**: shivi.singh3196@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/shivi-singh-a8156b216/


