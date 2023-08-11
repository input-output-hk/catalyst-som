export default {
  global: {
    title: "Project Catalyst Milestone Module"
  },
  errors: {
    fetching_proposals: "Error fetching projects.",
    fetching_proposals_count: "Error fetching projects count.",
    fetching_soms: "Error fetching Statement of Milestones.",
    fetching_users: "Error fetching users.",
    fetching_users_count: "Error fetching users count.",
    creating_poa_review: "Error creating Proof of Achievement review.",
    creating_poa: "Error creating Proof of Achievement.",
    creating_signoff: "Error creating Signoff.",
    creating_som_review: "Error creating Statement of Milestone review.",
    creating_som: "Error creating Statement of Milestone.",
    updating_allocations: "Error updating allocations."
  },
  notifications: {
    logged_in: "Logged in.",
    logged_out: "Logged out.",
    check_email: "Check your email to reset the password.",
    password_updated: "Password updated successfully!",
    poa_review_created: "Proof of Achievement review created.",
    poa_created: "Proof of Achievement created.",
    signoff_created: "Signoff created.",
    som_review_created: "Statement of Milestone review created.",
    som_created: "Statement of Milestone created.",
    allocation_updated: "Allocation updated."
  },
  nav: {
    home: "Home",
    proposals: "Projects",
    login: "Login",
    profile: "Profile",
    to_do_list_updates: "Todo list / Updates",
    admin: "Admin",
    logout: "Logout {name}"
  },
  next_payment: {
    to_be_distributed: "to be distributed in next batch.",
    as_poa_completion: "as Proof of Achievement completion.",
    as_monthly_chunk: "as monthly payment."
  },
  admin: {
    select_role: "Select role",
    add_challenge: "Add a challenge",
    add_proposal: "Add a project"
  },
  milestone: {
    som: "Statement of Milestone {nr}",
    latest_som: "Latest submission of the Statement of Milestone {nr}.",
    archived: "Archived Statements of Milestone {nr}",
    submit_new_som: "Submit new Statement of Milestone",
    resubmit_som: "Resubmit Statement of Milestone",
    resubmission_title: "Statement of Milestone resubmission confirmation",
    resubmission_msg: "Are you sure you want to resubmit this Statement of Milestone (SoM)? The current SoM and all its reviews will be archived. The new SoM submission will have to go through the review process again.",
    resubmission_confirm: "Proceed with resubmission",
    resubmission_clear: "Cancel",
    all_approvals: "At the moment your Statement of Milestone (SoM) was approved by all the reviewers. Please wait for final signoff. After the SoM will be signed off you will be able to submit Proof of Achievement.",
    some_approvals: "Your Statement of Milestone (SoM) was partially approved. Please proceed with a new submission of the SoM addressing the comments made by reviewers by using the button on the right.",
    no_approvals: "Your Statement of Milestone was not approved. Please resubmit it addressing the comments made on reviews by using the button on the right.",
    waiting_reviews: "Please wait for additional reviews or for Statement of Milestone signoff.",
    show_archived_soms: "Show archived Statements of Milestone",
    hide_archived_soms: "Hide archived Statements of Milestone",
    jump_to_poa: "Jump to Proof of Achievement",
    final_som: "Statement of Final Milestone"
  },
  milestone_recap: {
    title: "M {nr}",
    final_title: "M Final",
    cost: "Milestone cost:",
    delivery: "Stated delivery on:",
    month: "Month {month}",
    payment_month: "Initial payment | Month {n} | Month {n}",
    payment: "Payments schedule:",
    payment_starts: "Payments starts after previous milestone Proof of Achievement approval.",
    last_payment: "Last payment occurs after Project Closeout approval.",
    poa: "Proof of Achievement:"
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
    reviews: "Proof of Achievement reviews",
    signed_off_at: "Approved by Catalyst sign off user on:",
    submit: "Submit review for this Proof of Achievement",
    resubmit: "Resubmit review for this Proof of Achievement",
    signoff: "Signoff",
    all_approvals: "At the moment your Proof of Achievement (PoA) was approved by all the reviewers. Please wait for PoA signoff.",
    some_approvals: "Your Proof of Achievement (PoA) was partially approved. Please proceed with a new submission of the PoA addressing the comments made by reviewers by using the button above.",
    no_approvals: "Your Proof of Achievement was not approved. Please resubmit it addressing the comments made on reviews by using the button above.",
    waiting_reviews: "Please wait for additional reviews or for Proof of Achievement signoff.",
    resubmission_title: "Proof of Achievement resubmission",
    resubmission_msg: "Are you sure you want to resubmit this Proof of Achievement (PoA)? The current PoA and all its reviews will be archived. The new PoA submission will have to go through the review process again.",
    resubmission_confirm: "Proceed with resubmission",
    resubmission_clear: "Cancel"
  },
  signoff: {
    poa_signed_off_at: "Proof of Achievement approved by Catalyst sign off user on:"
  },
  new_poa: {
    title: "New Proof of Achievement for Milestone {nr}",
    submit: "Submit Proof of Achievement",
    reset: "Reset",
    content: "Content",
    content_help: "Please describe the Proof of Achievement, including links to resources (if any). Remember that the PoA has to satisfy the \"Outputs\", the \"Acceptance Criteria\" and the \"Evidence of Milestone Completion\" indicated in the Statement of Milestone.",
  },
  poas: {
    title: "Proof of Achievement",
    hide_archived: "Hide archived Proofs of Achievement",
    show_archived: "Show archived Proofs of Achievement",
    archived: "Archived Proofs of Achievement"
  },
  poa_review: {
    from: "From",
    submitted_at: "Submitted at:",
    resubmission_title: "Proof of Achievement review resubmission",
    resubmission_msg: "You have already submitted a review for this PoA. Do you want to resubmit it? The previous submission will be archived.",
    resubmission_confirm: "Proceed with resubmission",
    resubmission_clear: "Cancel"
  },
  new_poa_review: {
    title: "New Review for Proof of Achievement",
    submit: "Submit Proof of Achievement review",
    reset: "Reset",
    poa_approved: "PoA Approved?",
    poa_approved_help: "Tick the checkbox if the Proof of Achievement for the Statement of Milestone is approved.",
    comment: "Comment:",
    comment_help: "Please provide a description why Proof of Achievement (PoA) is approved. In case PoA is not approved, please describe what is missing and how the proposer can amend them in order to get the approval.",
  },
  poa_reviews: {
    open: "Open",
    close: "Close",
    poa_reviews: "{action} Proof of Achievement reviews",
    no_reviews: "No Proof of Achievement reviews",
    poa_archived_reviews: "Open archived Proof of Achievement reviews",
    archived_reviews: "These reviews are not active anymore and are archived. Each reviewer assigned to this project can have only one review active at a time and can't modify previous submissions. Every time a new review is submitted, the previous ones become archived.",
  },
  new_signoff: {
    title: "Signoff",
    confirm: "Confirm Signoff? This {entity} will be locked.",
    signoff: "Signoff",
    cancel: "Cancel",
    poa: "Proof of Achievement",
    som: "Statements of Milestone"
  },
  som: {
    submitted_at: "Statement of Milestone submitted at",
    title: "Milestone Title",
    outputs: "Milestone Outputs",
    success_criteria: "Acceptance criteria",
    evidence: "Evidence of milestone completion",
    month: "Delivery Month",
    cost: "Milestone Cost",
    completion: "Project Completion",
    signed_off_at: "Approved by Catalyst sign off user on:",
    open_reviews: "Open active reviews for this Milestone",
    open_archived_reviews: "Open archived reviews for this Milestone",
    archived_reviews: "These reviews are not active anymore and are archived. Each reviewer assigned to this project can have only one review active at a time and can't modify previous submissions. Every time a new review is submitted, the previous ones become archived.",
    submit_review: "Submit review for this Statement of Milestone",
    resubmit_review: "Resubmit review for this Statement of Milestone",
    submit_poa: "Submit new Proof of Achievement",
    resubmit_poa: "Resubmit Proof of Achievement",
    signoff: "Signoff",
    not_submitted: "Statement of Milestone not submitted yet!"
  },
  new_som: {
    component_title: "New Statement of Milestone {nr}",
    clone_latest: "Clone latest submission",
    submit: "Submit Statement of Milestone",
    reset: "Reset",
    title: "Title:",
    outputs: "Outputs:",
    success_criteria: "Acceptance Criteria:",
    evidence: "Evidence of milestone completion:",
    cost: "Cost:",
    month: "Delivery month:",
    completion: "Completion %",
    title_help: "A milestone is the key deliverable(s) required to complete this phase of the project and position your project towards the next milestone. Please make sure the milestone is very clearly described to avoid any delays in payment at the milestone completion stage.",
    outputs_help: "You should specify the context and number of outputs you will produce. For example: new UIUX designs, customer/user-centred research, work package technical outputs, documentation, prototypes, demonstrators/pilots, white-paper, business/tokenomics model, events, research papers, measurable engagement, reference/production software implementation or any other outputs you will provide.",
    success_criteria_help: "Acceptance criteria are linked to intended outcomes and targets and are standards/levels by which to judge whether an objective/goal/ target/outcome has been achieved/successful.",
    evidence_help: "The evidence you submit must show clearly and visibly that this milestone has been completed.",
    month_help: "In which month do you plan to complete this milestone. Month 1 of your project should be the same month as the initial payment. Month 2 is the next month after your initial payment.",
    cost_help: "What is the cost forecast in {currency} to complete this milestone? The cost of the milestone cannot exceed 30% of the whole budget. For this milestone you cannot exceed {maxCost}.",
    completion_help: "Once you have completed this milestone, how much in % terms will you have completed of your project? The completion must be at least 10% more than the previous milestone."
  },
  som_review: {
    from: "From",
    approved: "Approved",
    not_approved: "Not Approved",
    submitted_at: "Submitted at:",
    system: "System",
    outputs: "outputs",
    acceptance_criteria: "acceptance criteria",
    evidence: "evidence",
    resubmission_title: "SoM review resubmission",
    resubmission_msg: "You have already submitted a review for this Statement of Milestone. Do you want to resubmit it? The previous submission will be archived.",
    resubmission_confirm: "Proceed with resubmission",
    resubmission_clear: "Cancel"
  },
  new_som_review: {
    title: "New Review for Statement of Milestone",
    submit: "Submit",
    reset: "Reset",
    outputs_approved: "Outputs approved?",
    outputs_approved_help: "Tick the checkbox if the \"Outputs\" of the Statement of Milestone are approved.",
    outputs_comment: "Comment on \"Outputs\":",
    outputs_comment_help: "Please provide a description why \"Outputs\" are approved. In case the \"Outputs\" aren't approved, please describe what is missing and how the proposer can amend them in order to get the approval.",
    success_criteria_approved: "\"Acceptance criteria\" approved?",
    success_criteria_approved_help: "Tick the checkbox if the \"Acceptance Criteria\" of the Statement of Milestone are approved.",
    success_criteria_comment: "Comment on \"Acceptance criteria\":",
    success_criteria_comment_help: "Please provide a description why \"Acceptance criteria\" are approved. In case the \"Acceptance criteria\" aren't approved, please describe what is missing and how the proposer can amend them in order to get the approval.",
    evidence_approved: "\"Evidence of milestone completion\" approved?",
    evidence_approved_help: "Tick the checkbox if the \"Evidence of milestone completion\" of the Statement of Milestone are approved.",
    evidence_comment: "Comment on \"Evidence of milestone completion\":",
    evidence_comment_help: "Please provide a description why \"Evidence of milestone\" is approved. In case the \"Evidence of milestone completion\" is not approved, please describe what is missing and how the proposer can amend them in order to get the approval.",
  },
  roles: {
    funded_proposer: "Funded proposer",
    ct_member: "Challenge Team member",
    io_member: "Catalyst Team member",
    admin: "Admin",
    signoff: "Signoff"
  },
  proposal_recap: {
    proposal_id: "Project ID",
    link: "Link",
    open_ideascale: "Open in Ideascale",
    challenge: "Challenge",
    budget: "Budget",
    completion: "Completion date",
    funds_distributed: "Funds distributed",
    allocated_budget_error: "Total budget allocated in Statements of Milestone",
    budget_error: "Error in budget allocated to Statements of Milestone.",
    budget_error_msg: "The budget currently allocated in Statements of Milestone (SoM) ({allocated}) doesn't correspond to the total budget of the project ({total}). Please resubmit SoMs to address this error.",
    ok: "OK",
    starting_date: "Start date",
    scheduled_starting_date: "Scheduled start date"
  },
  reviews_counter: {
    approvals: "approval | approvals",
    refusals: "refusal | refusals",
  },
  allocation: {
    allocation: "Allocation",
    add_allocation: "Add allocation"
  },
  validations: {
    text_required: "This is a required field",
    min_text_required: "This field must be at least {min} characters long",
  },
  footer: {
    website: 'Website',
    knowledge_base: 'Knowledge Base',
    privacy_policy: 'Privacy Policy'
  },
  pages: {
    admin: {
      title: "Admin",
      description: "Page for the administration of users.",
      email: "Email",
      username: "Username",
      role: "Role",
      challenges: "Challenges",
      proposals_as_owner: "Projects (as owner)",
      proposals_allocated: "Projects allocated (as reviewer)",
    },
    home: {
      title: "Project Catalyst<br />Milestone Module",
      discover: "Discover projects",
      how: "How it works",
      faq: "FAQ"
    },
    login: {
      title: "Login",
      description: "Login as Funded Proposer, Challenge Team member or Catalyst team member to interact with milestones.",
      email: "Email",
      password: "Password",
      login: "Login",
      reset: "Reset Password"
    },
    milestones: {
      back: "Go back to main project page.",
      milestone: "Milestone {nr}",
      final_milestone: "Final Milestone"
    },
    profile: {
      title: "User Profile",
      email: "Email",
      username: "Username",
      role: "Role",
      proposals: "Projects (as Funded Proposer):",
      challenges: "Challenges (as Challenge Team):",
      proposals_allocated: "Projects allocated to review:"
    },
    proposal: {
      open_details: "Open Milestones Details",
      milestone_recap: "Milestones Recap"
    },
    proposals: {
      page_title: "Funded Projects",
      description: "All the projects in the Statement of Milestone pilot.",
      export: "Export CSV",
      id: "ID",
      title: "Title",
      challenge: "Challenge",
      budget: "Budget",
      allocations: "Allocations"
    },
    reset_password: {
      title: "Reset password",
      description: "",
      password: "Password",
      reset: "Reset"
    },
    notifications: {
      go_to_som: "Open Statement of Milestone",
      go_to_poa: "Open Proof of Achievement",
      proposal: "Project",
      milestone: "Milestone",
      submitted_at: "Submitted at",
      signedoff_at: "Approved by Catalyst sign off user on",
      poa_to_review: "Proof of Achievement to be reviewed",
      som_to_review: "Statement of Milestone to be reviewed",
      signoff_received: "Final approvals received in the last day | Final approvals received in the last {count} days",
      no_notifications: "No notifications, no relevant events happened from your last visit.",
      som_reviews_received: "Statement of Milestone reviews received",
      poa_reviews_received: "PoA reviews received",
      approved: "Approved",
      not_approved: "Not Approved",
      open_som_to_resubmit: "Open and resubmit Statement of Milestone",
      open_poa_to_resubmit: "Open and resubmit Proof of Achievement",
      nr_reviews: "# of reviews:",
      nr_approvals: "# of approvals:",
      from: "Submitted from:",
      poa_to_signoff_received: "Proof of Achievement to be signed off",
      som_to_signoff_received: "Statement of Milestone to be signed off",
      filter: "Apply filter",
      no_filter_results: "No results found with current filters criteria",
      open_poa_to_signoff: "Open and signoff Proof of Achievement",
      open_som_to_signoff: "Open and signoff Statement of Milestone",
    }
  }
}
