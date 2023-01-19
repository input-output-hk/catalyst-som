export default {
  global: {
    title: "Project Catalyst Milestone Module"
  },
  errors: {
    fetching_proposals: "Error fetching proposals.",
    fetching_proposals_count: "Error fetching proposals count.",
    fetching_soms: "Error fetching soms.",
    fetching_users: "Error fetching users.",
    fetching_users_count: "Error fetching users count.",
    creating_poa_review: "Error creating PoA review.",
    creating_poa: "Error creating PoA.",
    creating_signoff: "Error creating Signoff.",
    creating_som_review: "Error creating SoM review.",
    creating_som: "Error creating SoM.",
    updating_allocations: "Error updatung allocations."
  },
  notifications: {
    logged_in: "Logged in.",
    logged_out: "Logged out.",
    check_email: "Check your email to reset the password.",
    password_updated: "Password updated successfully!",
    poa_review_created: "PoA review created.",
    poa_created: "PoA created.",
    signoff_created: "Signoff created.",
    som_review_created: "SoM review created.",
    som_created: "SoM created.",
    allocation_updated: "Allocation updated."
  },
  nav: {
    home: "Home",
    proposals: "Proposals",
    login: "Login",
    profile: "Profile",
    admin: "Admin",
    logout: "Logout {name}"
  },
  admin: {
    select_role: "Select role",
    add_challenge: "Add a challenge",
    add_proposal: "Add a proposal"
  },
  milestone: {
    som: "Statement of Milestone {nr}",
    latest_som: "Latest submission from proposers of the Statement of Milestone {nr}.",
    archived: "Archived Statements of Milestone {nr}"
  },
  milestone_recap: {
    title: "M {nr}",
    cost: "Milestone cost:",
    delivery: "Delivery on:",
    month: "Month {month}",
    payment: "Payments schedule:",
    payment_starts: "Payments starts after previous milestone PoA approval.",
    last_payment: "Last payment occurs after Project Closeout approval.",
    poa: "PoA:"
  },
  table: {
    next: "Next page",
    previous: "Previous page",
    page: "Page",
    current: "Current"
  },
  poa: {
    poa: "Content:",
    submitted_at: "Submitted at:",
    reviews: "PoA reviews",
    signed_off_at: "Signed off at:",
    submit: "Submit review for this PoA",
    signoff: "Signoff"
  },
  new_poa: {
    title: "New Proof of Achivement for Milestone {nr}",
    submit: "Submit PoA",
    reset: "Reset",
    content: "Content"
  },
  poas: {
    title: "Proof of Achivements",
    hide_archived: "Hide archived PoAs",
    show_archived: "Show archived PoAs",
    archived: "Archived Proof of Achivements"
  },
  poa_review: {
    from: "From",
    submitted_at: "Submitted at:"
  },
  new_poa_review: {
    title: "New Review for Proof of Achievement",
    submit: "Submit PoA review",
    reset: "Reset",
    poa_approved: "PoA Approved?",
    comment: "Comment:",
  },
  poa_reviews: {
    open: "Open",
    close: "Close",
    poa_reviews: "{action} PoA reviews",
    no_reviews: "No PoA reviews"
  },
  new_signoff: {
    title: "Signoff",
    confirm: "Confirm Signoff? This {entity} will be locked.",
    signoff: "Signoff",
    cancel: "Cancel",
    poa: "PoA",
    som: "SoM"
  },
  som: {
    submitted_at: "SoM Submitted at",
    title: "Milestone Title",
    outputs: "Milestone Outputs",
    acceptance_criteria: "Acceptance criteria",
    evidence: "Milestone Evidence",
    month: "Delivery Month",
    cost: "Milestone Cost",
    completion: "Project Completion",
    signed_off_at: "Signed off at:",
    open_reviews: "Open reviews for this Milestone",
    submit_review: "Submit review for this SoM",
    submit_poa: "Submit new PoA",
    signoff: "Signoff",
    not_submitted: "Statement of Milestone not submitted yet!"
  },
  new_som: {
    component_title: "New Statement of Milestone {nr}",
    clone_latest: "Clone latest submission",
    submit: "Submit SoM",
    reset: "Reset",
    title: "Title:",
    outputs: "Outputs:",
    success_criteria: "Success Criteria:",
    evidence: "Evidence:",
    cost: "Cost:",
    month: "Delivery month:",
    completion: "Completion %"
  },
  som_review: {
    from: "From",
    approved: "Approved",
    not_approved: "Not Approved",
    submitted_at: "Submitted at:",
    system: "System",
    outputs: "outputs",
    acceptance_criteria: "acceptance criteria",
    evidence: "evidence"
  },
  new_som_review: {
    title: "New Review for Statement of Milestone",
    submit: "Submit",
    reset: "Reset",
    outputs_approved: "Outputs approved?",
    outputs_comment: "Outputs comment:",
    success_criteria_approved: "Success criteria approved?",
    success_criteria_comment: "Success criteria comment:",
    evidence_approved: "Evidence approved?",
    evidence_comment: "Evidence comment:",
  },
  roles: {
    funded_proposer: "Funded proposer",
    ct_member: "Challenge Team member",
    io_member: "IOG Team member",
    admin: "Admin",
    signoff: "Signoff"
  },
  proposal_recap: {
    proposal_id: "Proposal ID",
    link: "Link",
    open_ideascale: "Open in Ideascale",
    challenge: "Challenge",
    budget: "Budget",
    completion: "Completion date"
  },
  reviews_counter: {
    approvals: "approval | approvals",
    refusals: "refusal | refusals",
  },
  allocation: {
    allocation: "Allocation",
    add_allocation: "Add allocation"
  },
  pages: {
    admin: {
      title: "Admin",
      description: "Page for the administration of users.",
      email: "Email",
      username: "Username",
      role: "Role",
      challenges: "Challenges",
      proposals_as_owner: "Proposals (as owner)",
      proposals_allocated: "Proposals allocated (as reviewer)",
    },
    home: {
      title: "Project Catalyst<br />Milestone Module",
      discover: "Discover proposals",
      how: "How it works",
      faq: "FAQ"
    },
    login: {
      title: "Login",
      description: "Login as Funded Proposer, Challenge Team member or IOG member to interact with milestones.",
      email: "Email",
      password: "Password",
      login: "Login",
      reset: "Reset Password"
    },
    milestones: {
      back: "Go back to main proposal page.",
      milestone: "Milestone {nr}"
    },
    profile: {
      title: "User Profile",
      email: "Email",
      username: "Username",
      role: "Role",
      proposals: "Proposals (as Funded Proposer):",
      challenges: "Challenges (as Challenge Team):"
    },
    proposal: {
      open_details: "Open Milestones Details",
      milestone_recap: "Milestones Recap"
    },
    proposals: {
      title: "Proposals",
      description: "All the proposals in the Statement of Milestone pilot.",
      export: "Export CSV"
    },
    reset_password: {
      title: "Reset password",
      description: "",
      password: "Password",
      reset: "Reset"
    }
  }
}
