import Role from "../models/Role.js";

const seedRoles = async () => {
  const roles = [
    { name: "owner", description: "Full access to board" },
    { name: "editor", description: "Can edit tasks and board" },
    { name: "viewer", description: "Can only view board" },
  ];
  for (const role of roles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
  }
  console.log("Roles seeded");
};

export default seedRoles;