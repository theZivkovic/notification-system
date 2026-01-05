import type {QueryResult} from "pg";
import {BlueBookEntryStatus, type BlueBookEntry} from "./blueBookEntry.js";
import {pool} from "./db.js";

const BlueBookEntryTable = "blue_book_entries";

class BlueBookEntryRepository {
  async setDelivered(id: number) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET status = '${BlueBookEntryStatus.DELIVERED}'
        WHERE id = $1 
        RETURNING *`,
      [id]
    );
    return queryResult.rows[0];
  }

  async setBlocked(id: number) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET 
          status = 'BLOCKED',
          retry_count = retry_count + 1
        WHERE id = $1
        RETURNING *`,
      [id]
    );
    return queryResult.rows[0];
  }

  async updateStatus(id: number, status: BlueBookEntryStatus) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET status = $1
        WHERE id = $2 
        RETURNING *`,
      [status, id]
    );
    return queryResult.rows[0];
  }
}

const blueBookEntryRepository = new BlueBookEntryRepository();
export {blueBookEntryRepository};
