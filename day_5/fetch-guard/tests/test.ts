import axios from 'axios';
async function load() {
    const res = await fetch('/api/users');
    try {
      const data = await axios.get('/api/posts');
    } catch(e) {}
}