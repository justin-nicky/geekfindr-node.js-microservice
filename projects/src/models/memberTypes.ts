export enum MemberTypes {
  Owner = 'owner',
  Admin = 'admin',
  Collaborator = 'collaborator',
  JoinRequest = 'joinRequest',
}

export enum MemberTypesRank {
  Owner = 0,
  Admin = 1,
  Collaborator = 2,
  JoinRequest = 3,
}

export const getRank = (memberType: MemberTypes): MemberTypesRank => {
  switch (memberType) {
    case MemberTypes.Owner:
      return MemberTypesRank.Owner
    case MemberTypes.Admin:
      return MemberTypesRank.Admin
    case MemberTypes.Collaborator:
      return MemberTypesRank.Collaborator
    case MemberTypes.JoinRequest:
      return MemberTypesRank.JoinRequest
    default:
      throw new Error('Invalid member type')
  }
}
