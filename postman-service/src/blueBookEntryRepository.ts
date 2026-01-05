import type {QueryResult} from "pg";
import {BlueBookEntryStatus, type BlueBookEntry} from "./blueBookEntry.js";
import {pool} from "./db.js";

const BlueBookEntryTable = "blue_book_entries";

class BlueBookEntryRepository {
  async setDelivered(id: number) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET status = $2
        WHERE id = $1 
        RETURNING *`,
      [id, BlueBookEntryStatus.DELIVERED]
    );
    return queryResult.rows[0];
  }

  async setTakenByPostman(id: number) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET 
          status = $2,
          delivering_by = $3
        WHERE id = $1
        RETURNING *`,
      [
        id,
        BlueBookEntryStatus.TAKEN_BY_POSTMAN,
        process.env.POSTMAN_NAME ?? "N/A",
      ]
    );
    return queryResult.rows[0];
  }

  async setBlocked(id: number) {
    const queryResult: QueryResult<BlueBookEntry> = await pool.query(
      `UPDATE ${BlueBookEntryTable}
        SET 
          status = $2,
          retry_count = retry_count + 1
        WHERE id = $1
        RETURNING *`,
      [id, BlueBookEntryStatus.BLOCKED]
    );
    return queryResult.rows[0];
  }
}

const blueBookEntryRepository = new BlueBookEntryRepository();
export {blueBookEntryRepository};
