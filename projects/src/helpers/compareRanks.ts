import { MemberTypes, getRank } from '../models/memberTypes'

export const hasHigerRank = (
  currentUserRole: MemberTypes,
  otherUserRole: MemberTypes
) => {
  return getRank(otherUserRole) > getRank(currentUserRole)
}

export const hasHigherOrEqualRank = (
  currentUserRole: MemberTypes,
  otherUserRole: MemberTypes
) => {
  return getRank(otherUserRole) >= getRank(currentUserRole)
}
