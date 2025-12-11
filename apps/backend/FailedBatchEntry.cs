class FailedBatchEntry<T> {
  public FailedBatchEntry(T entry, string reason) {
    Entry = entry;
    Reason = reason;
  }

  public readonly T Entry;
  public readonly string Reason;
}
