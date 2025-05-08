// signupUtils.ts
type User = {
  name: string;
  email: string;
  password: string;
};

export function signup(name: string, email: string, password: string): boolean {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];

  const userExists = users.some(u => u.email === email);
  if (userExists) {
    alert('Email already registered');
    return false;
  }

  const newUser: User = { name, email, password };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return true;
}
