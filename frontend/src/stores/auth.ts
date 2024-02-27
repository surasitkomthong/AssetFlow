import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { adminLogin } from '@/service/auth';
import Swal from 'sweetalert2';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('token')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        // console.log(username, password, '-------------');
        const response = await adminLogin(username, password);
        // console.log(response);

        if (response.token != null) {
          const token = response.token;

          // Update Pinia state
          this.user = response.token;

          // Store user details and jwt in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(response.token));
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have successfully logged in!',
            timer: 2000, // 2 seconds
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            // Redirect to previous url or default to home page
            router.push(this.returnUrl || '/transaction');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Unsuccessful',
            timer: 2000, // 2 seconds
            timerProgressBar: true,
            showConfirmButton: false
          });
          // Handle case where token is null
          // console.error('Token is null. Login unsuccessful.');
        }
      } catch (error) {
        console.error('Error while logging in:', error);
        // Handle login error
      }
    },

    logout() {
      this.user = null;
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  }
});
