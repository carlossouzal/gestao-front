import axios from '../axios';

const login = async (credentials) => {
  try{
    const result = await axios.post('/auth/login', credentials);
    return result;
  }catch(err){
    return err.response;
  }
};

const getAuthorization = async () => {
  return `Bearer ${localStorage.getItem('access_token')}`;
};

const profile = async () => {
  const config = {
    headers:{
      Authorization: await getAuthorization()
    }
  };

  try{
    return await axios.get('/profile', config);
  }catch(err){
    return err.response;
  }
};

const isAuthenticate = async () => {
  const token = localStorage.getItem('access_token');
  return token;
};

export {
  login,
  profile,
  isAuthenticate
}