## REGISTRATION & LOGIN TESTING GUIDE

### 🧪 How to Test Registration and Login

#### 1. **Test Registration**
1. Go to: http://localhost:3000/register
2. Fill out the form with:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `test123`
   - Confirm Password: `test123`
3. Click "Registrarse"
4. **Expected Result**: Should redirect to login page with success message

#### 2. **Test Login**
1. Go to: http://localhost:3000/login
2. Use the same credentials:
   - Email: `test@example.com`
   - Password: `test123`
3. Click "Iniciar Sesión"
4. **Expected Result**: Should redirect to homepage with user name in navbar

#### 3. **Check Server Logs**
Look for these console messages:
- 📝 Registration data: { email, nombre, hasPassword, hasConfirmPassword }
- 🔍 Checking if user exists: email
- 👤 Creating new user...
- ✅ User created successfully: email
- 🔑 Login data: { email, hasPassword }
- 🔍 Looking up user in database: email
- ✅ User found in database: email
- 🔐 Verifying password...
- ✅ Password verified successfully

#### 4. **Verify Database**
If you have access to the database, check:
- User should appear in `usuarios` table
- Password should be hashed (not plain text)
- Email should match what was registered

#### 5. **Test Errors**
- Try registering with same email (should show "email already registered")
- Try login with wrong password (should show "incorrect credentials")
- Try login with non-existent email (should show "incorrect credentials")

### 🚨 Common Issues
- If registration fails: Check server logs for error messages
- If login fails: Verify password hashing is working correctly
- If user doesn't appear in database: Check database connection

### ✅ Success Indicators
- Registration shows success message and redirects to login
- Login works and redirects to homepage
- User name appears in navbar after login
- No error messages in console
