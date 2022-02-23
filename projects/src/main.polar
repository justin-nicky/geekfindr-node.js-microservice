allow(actor, action, resource) if
  has_permission(actor, action, resource);

actor User {}

resource Project {
  permissions = ["read", "push", "delete"];
  roles = ["owner", "admin", "contributor", "teamJoinRequest"];

  "read" if "contributor";
  "push" if "admin";
  "delete" if "owner";

  "admin" if "owner";
  "contributor" if "owner";
}

# This rule tells Oso how to fetch roles for a user
has_role(actor: User, role_name: String, project: Project) if
  role in actor.roles and
  role_name = role.name and
  repository = role.repository;
