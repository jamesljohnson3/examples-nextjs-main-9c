import { gql } from '@apollo/client';

export const DELETE_SEGMENT = gql`
  mutation DeleteSegment($segmentId: String!) {
    delete_Segment(where: { id: { _eq: $segmentId } }) {
      affected_rows
    }
  }
`;
