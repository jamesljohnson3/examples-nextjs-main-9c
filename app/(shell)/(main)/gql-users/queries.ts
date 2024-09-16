
import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query {
    User(order_by: { createdAt: desc }, limit: 4) {
      id
    }
  }
`;


