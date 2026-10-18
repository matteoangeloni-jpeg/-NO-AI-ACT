import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import type { Database, Statement } from './types';

export class LocalDatabase implements Database {
  readonly sqlite: DatabaseSync;
  constructor(path = ':memory:') {
    this.sqlite = new DatabaseSync(path);
    const migrations = new URL('./migrations/', import.meta.url);
    for (const file of readdirSync(migrations).filter(f => f.endsWith('.sql')).sort()) this.sqlite.exec(readFileSync(new URL(file, migrations), 'utf8'));
  }
  prepare(sql: string): LocalStatement { return new LocalStatement(this.sqlite, sql); }
  async batch(statements: Statement[]): Promise<unknown[]> {
    // This local adapter cannot interleave concurrent transactions on one connection.
    this.sqlite.exec('BEGIN IMMEDIATE');
    try {
      const result = [];
      for (const s of statements) result.push(await s.run());
      this.sqlite.exec('COMMIT'); return result;
    } catch (e) { this.sqlite.exec('ROLLBACK'); throw e; }
  }
  close(): void { this.sqlite.close(); }
}
class LocalStatement implements Statement {
  private values: unknown[] = [];
  constructor(private db: DatabaseSync, private sql: string) {}
  bind(...values: unknown[]): LocalStatement { const s = new LocalStatement(this.db, this.sql); s.values = values; return s; }
  async all<T>(): Promise<{ results: T[] }> { return { results: this.db.prepare(this.sql).all(...this.values as (string | number)[]) as T[] }; }
  async run(): Promise<unknown> { return this.db.prepare(this.sql).run(...this.values as (string | number)[]); }
}
