import {createRouter} from 'vue-router'
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import ResetPassword from '../pages/ResetPassword.vue';
import Profile from '../pages/Profile.vue';
import Proposals from '../pages/Proposals.vue';
import Proposal from '../pages/Proposal.vue';

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/reset-password',
    component: ResetPassword
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/proposals',
    component: Proposals
  },
  {
    path: '/proposals/:id',
    component: Proposal,
    name: 'proposal'
  }
]

export default function (history) {
  return createRouter({
    history,
    routes
  })
}
