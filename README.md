# ClearCom AI Agent

ClearCom AI Agent is a powerful web application that helps users enhance their writing and craft perfect email responses using advanced AI technology. The application supports multiple languages and provides a seamless user experience for text enhancement and email response generation.

## Features

- **Text Enhancement**: Polish your writing with AI-powered suggestions that improve clarity, grammar, and style while maintaining your unique voice.
- **Smart Email Responses**: Generate professional email responses in seconds, perfect for business communication and customer service.
- **Multi-language Support**: Available in:
  - English
  - French
  - German
  - Chinese
  - Hindi
  - Arabic
  - Persian
- **Customizable Tone**: Choose between formal, semi-formal, and informal tones for your content.
- **Secure Authentication**: Email-based authentication system with password reset functionality.
- **Responsive Design**: Beautiful, modern interface that works seamlessly across all devices.

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - Lucide React (for icons)
  - i18next (for internationalization)

- **Backend**:
  - Supabase (Authentication & Database)
  - OpenAI API (AI text processing)

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
\`\`\`

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/clearcom.git
   cd clearcom
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Building for Production

To create a production build:

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist` directory.

## Database Setup

The project uses Supabase for database management. The necessary migrations are included in the `supabase/migrations` directory. These set up:

- User profiles
- Access request system
- Row-level security policies
- Authentication triggers

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is proprietary software owned by Novalycs Inc. All rights reserved.

## Support

For support, please contact: jafar@novalycs.com

## Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for the backend infrastructure
- The React team for the amazing framework
- All contributors who have helped shape this project
