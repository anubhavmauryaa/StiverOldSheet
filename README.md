# Striver's A2Z DSA Course Frontend

A beautiful, modern frontend for displaying Striver's A2Z DSA Course content. This React application provides an interactive way to browse through the comprehensive DSA course with all the topics, problems, and resources.

## Features

🚀 **Modern UI Design**
- Clean, responsive design with gradient backgrounds
- Collapsible sections for easy navigation
- Beautiful cards with hover effects
- Mobile-friendly responsive layout

🔍 **Smart Search**
- Real-time search across all topics and problems
- Search by topic name, step title, or sub-step title
- Instant filtering of results

📊 **Progress Tracking**
- Overview statistics showing total steps, sub-sections, and topics
- Progress indicators for each section
- Difficulty badges for problems

🔗 **Quick Access Links**
- Direct links to YouTube videos
- Links to articles and tutorials
- Practice problem links (LeetCode, GeeksforGeeks, Coding Ninjas)
- TakeUforward+ premium content links

## Course Structure

The course is organized into multiple steps:

1. **Learn the basics** - Fundamental programming concepts
2. **Learn Important Sorting Techniques** - Various sorting algorithms
3. **Solve Problems on Arrays** - Array-based problem solving
4. And many more advanced topics...

Each step contains:
- Multiple sub-sections covering specific topics
- Individual problems with difficulty ratings
- Multiple resource links for learning and practice

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd c:\Users\PC\Desktop\coding\PYTHON\Striver\recursion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React entry point
├── index.css       # Global styles
└── data.json       # Course data (Striver's A2Z DSA content)
```

## Usage

### Browsing Content
- Click on any step to expand and view its sub-sections
- Click on sub-sections to view individual topics
- Each topic card shows the difficulty level and available resources

### Searching
- Use the search bar at the top to find specific topics
- Search works across topic titles, step names, and sub-step names
- Results are filtered in real-time as you type

### Accessing Resources
- **🎥 Watch Video** - YouTube explanations
- **📖 Read Article** - Detailed tutorials
- **💻 LeetCode** - Practice problems on LeetCode
- **🧑‍💻 GeeksforGeeks** - Practice problems on GFG
- **🎯 Coding Ninjas** - Practice problems on Coding Ninjas
- **🏆 TakeUforward+** - Premium content access

## Customization

### Adding New Content
To add new course content, update the `src/data.json` file following the existing structure:

```json
{
  "step_no": 1,
  "step_title": "Your Step Title",
  "sub_steps": [
    {
      "sub_step_no": 1,
      "sub_step_title": "Your Sub-step Title",
      "topics": [
        {
          "id": "unique_id",
          "question_title": "Topic Title",
          "difficulty": 0, // 0=Basic, 1=Easy, 2=Medium, 3=Hard
          "yt_link": "https://youtube.com/...",
          "post_link": "https://...",
          "lc_link": "https://leetcode.com/...",
          // ... other links
        }
      ]
    }
  ]
}
```

### Styling
- Modify `src/App.css` for component-specific styles
- Update `src/index.css` for global styles
- The project uses Tailwind CSS for utility classes

## Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **PostCSS & Autoprefixer** - CSS processing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is created for educational purposes. The course content belongs to [TakeUforward](https://takeuforward.org).

## Acknowledgments

- **Striver (Raj Vikramaditya)** - For creating the comprehensive A2Z DSA course
- **TakeUforward** - For providing high-quality DSA content
- Course data sourced from Striver's official A2Z DSA course

## Support

If you find this frontend helpful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 📚 Following Striver's content on [TakeUforward](https://takeuforward.org)

---

**Happy Learning! 🚀**

Master Data Structures and Algorithms with this interactive frontend for Striver's comprehensive course.
