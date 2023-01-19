import {createRouter} from 'vue-router'
import Home from '@/pages/Home.vue';
import Login from '@/pages/Login.vue';
import ResetPassword from '@/pages/ResetPassword.vue';
import Profile from '@/pages/Profile.vue';
import Proposals from '@/pages/Proposals.vue';
import Proposal from '@/pages/Proposal.vue';
import Milestones from '@/pages/Milestones.vue';
import Notifications from '@/pages/Notifications.vue';
import Admin from '@/pages/Admin.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
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
    name: 'proposals',
    component: Proposals
  },
  {
    path: '/proposals/:id',
    component: Proposal,
    name: 'proposal'
  },
  {
    path: '/proposals/:id/milestones',
    component: Milestones,
    name: 'proposal-milestones'
  },
  {
    path: '/proposals/:id/milestones/:milestone',
    component: Milestones,
    name: 'proposal-milestones-detail'
  },
  {
    path: '/admin',
    component: Admin,
    name: 'admin'
  },
  {
    path: '/notifications',
    component: Notifications,
    name: 'notifications'
  }
]

export default function (history) {
  return createRouter({
    history,
    routes
  })
}
