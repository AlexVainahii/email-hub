# Email-Hub

Email-Hub is the backend of the application that provides a set of useful features for managing users and their tasks. It enables user authentication and authorization, user data modification, task creation and editing, reviews management, and many other useful options.

## Functionality

### User Authentication and Authorization

- Registration of a new user with email confirmation capability.
- Login of a registered user into the system.
- Change and update user data.
- User authorization confirmation.
- Email verification.
- Sending an email to reset the password if the user forgets it.
- Password change.

### User Task Management

- Addition of new tasks for the user.
- Editing and updating user tasks.
- Deletion of tasks by their ID.
- Retrieving a list of all user tasks for the current month.
- Populating the database with fake tasks for frontend testing.

### User Review Management

- Adding new reviews for the user.
- Editing and updating user reviews.
- Deletion of user reviews by their ID.
- Retrieving a list of all reviews.

### Environment Variable Configuration

Create a `.env` file in the project's root directory and configure environment variables according to your needs. Remember that these are just examples of variables. For security, do not include `.env` files in your repository. Use `.env.example` as an example of configuration.

```plaintext



DB_HOST=your_database_url
PORT=your_Backend_port
SECRET_KEY=your_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
BASE_URL==your_backend_server
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
BASE_URL_FRONT=front_url

```
