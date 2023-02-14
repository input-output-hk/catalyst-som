import {createRouter} from 'vue-router'
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import ResetPasswordPage from '@/pages/ResetPasswordPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import ProposalsPage from '@/pages/ProposalsPage.vue';
import ProposalPage from '@/pages/ProposalPage.vue';
import MilestonesPage from '@/pages/MilestonesPage.vue';
import NotificationsPage from '@/pages/NotificationsPage.vue';
import AdminPage from '@/pages/AdminPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/reset-password',
    component: ResetPasswordPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/proposals',
    name: 'proposals',
    component: ProposalsPage
  },
  {
    path: '/proposals/:id',
    component: ProposalPage,
    name: 'proposal'
  },
  {
    path: '/proposals/:id/milestones',
    component: MilestonesPage,
    name: 'proposal-milestones'
  },
  {
    path: '/proposals/:id/milestones/:milestone',
    component: MilestonesPage,
    name: 'proposal-milestones-detail'
  },
  {
    path: '/admin',
    component: AdminPage,
    name: 'admin'
  },
  {
    path: '/notifications',
    component: NotificationsPage,
    name: 'notifications'
  }
]

export default function (history) {
  return createRouter({
    history,
    routes
  })
}
