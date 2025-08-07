Available Routes:

General:

- `/` - [GET] Root API Page

Auth:

- `/auth/register` - [POST] Register new user page
- `/auth/login` - [POST] Login user to obtain Access and Refresh JWT
- `/auth/refresh-token` - [POST] Provides fresh access/refresh tokens (uses refresh JWT in body)

Protected Routes:

- `/users` - [GET] example endpoint that requires authorization header with access token
