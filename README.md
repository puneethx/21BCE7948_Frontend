# Trademarkia Search Application

This **Next.js** application provides a user-friendly interface searching and filtering trademark information using a custom API. The application provides filtering options and displays the results in either list or grid view.

## Features

- **Search Functionality**: Input a search query to find trademarks.
- **Status Filtering**: Trademarks can be filtered by their current status (Registered, Pending, Abandoned, Others).
- **Advanced Filtering**: Additional filters for Owners, Law Firms, and Attorneys.
- **Pagination**: Navigate through the search results.
- **Switch View Mode**: Choose between list or grid view to display search results.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **Axios**: For making API requests to the backend.
- **CSS Modules**: For scoped and reusable CSS, ensuring styling does not leak.
- **Images**: Integrated with Next.js `Image` component for optimized image handling.

## Project Structure

```bash
src/
├── app/
│   ├── images/             # Folder for images
│   ├── layout.js           # Defines layout and structure
│   ├── global.css          # Global styles
│   ├── page.js             # Main application logic and rendering
│   └── page.module.css     # CSS module for scoped styles
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## Usage

- Enter a trademark in the search bar and hit **Search**.
- Use the filter tabs to filter by **Owners**, **Law Firms**, or **Attorneys**.
- Switch between **List** and **Grid** view for displaying results.
- Pagination allows you to navigate between multiple pages of results.

# API Integration

The application interacts with the **Trademarkia** API for fetching trademark data. The search queries and filter options are sent via **POST** requests, and results are displayed dynamically. 

``` https://vit-tm-task.api.trademarkia.app/api/v3/us ```

## Project Snapshots
![trademarkia3](https://github.com/user-attachments/assets/8a9de59e-e16c-4686-8d4d-0e6bd4c6b88c)
![trademarkia4](https://github.com/user-attachments/assets/090a9339-471e-4fb1-b62a-609c2aedbd2e)
![trademarkia5](https://github.com/user-attachments/assets/6dc15cd5-6f3b-467e-935a-9ced843e4bc6)

## Custom Filter
![trademarkia7](https://github.com/user-attachments/assets/27caa38f-a0f0-4cb9-8b68-9f1e992d45d0)

