export interface ReleaseSetOptions {
  token?: string; // Authentication token for the release process
  notes?: string; // Optional comma-separated list of release notes
  metadata?: string; // Additional metadata as a JSON string 
  metadataFile?: string; // Path to a file containing JSON metadata
  name?: string
}
