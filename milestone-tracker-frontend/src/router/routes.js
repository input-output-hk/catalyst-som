import { createRouter } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import ResetPasswordPage from '@/pages/ResetPasswordPage.vue'
import ConfirmResetPasswordPage from '@/pages/ConfirmResetPasswordPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import ProposalsPage from '@/pages/ProposalsPage.vue'
import ProposalPage from '@/pages/ProposalPage.vue'
import MilestonesPage from '@/pages/MilestonesPage.vue'
import NotificationsPage from '@/pages/NotificationsPage.vue'
import SubmissionsPage from '@/pages/SubmissionsPage.vue'
import FundingPage from '@/pages/FundingPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

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
    name: 'reset-password',
    component: ResetPasswordPage
  },
  {
    path: '/confirm-reset-password',
    component: ConfirmResetPasswordPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/projects',
    name: 'proposals',
    component: ProposalsPage
  },
  {
    path: '/projects/:id',
    component: ProposalPage,
    name: 'proposal'
  },
  {
    path: '/projects/:id/milestones',
    component: MilestonesPage,
    name: 'proposal-milestones'
  },
  {
    path: '/projects/:id/milestones/:milestone',
    component: MilestonesPage,
    name: 'proposal-milestones-detail'
  },
  {
    path: '/projects/:id/milestones/:milestone/:section',
    component: MilestonesPage,
    name: 'proposal-milestones-detail-section'
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
  },
  {
    path: '/latest-submissions',
    component: SubmissionsPage,
    name: 'latest-submissions'
  },
  {
    path: '/funding',
    component: FundingPage,
    name: 'funding'
  }
]

export default function (history) {
  return createRouter({
    history,
    routes,
    scrollBehavior(to) {
      if(to.name === 'proposal-milestones-detail-section') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              el: `#${to.params.section}`,
              behavior: 'smooth'
            })
          }, 200)
        })
      }
    }
  })
}
