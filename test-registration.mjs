import authClient from './prisma/auth-client.js';

async function testRegistration() {
  try {
    console.log('Testing user registration...');
    
    // Test creating a user
    const testUser = await authClient.createUserWithHash({
      email: 'test@example.com',
      nombre: 'Test User',
      contraseña: 'test123',
      admin: false
    });
    
    console.log('✅ User created successfully:', testUser.email);
    
    // Test verifying the user
    const verifiedUser = await authClient.verifyUser('test@example.com', 'test123');
    console.log('✅ User verified successfully:', verifiedUser.email);
    
    // Clean up - delete test user
    await authClient.client.usuario.delete({
      where: { email: 'test@example.com' }
    });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await authClient.disconnect();
  }
}

testRegistration();
