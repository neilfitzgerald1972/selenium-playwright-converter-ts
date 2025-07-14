// Type for our mock file system stats
export interface MockStats {
  isFile: () => boolean;
  isDirectory: () => boolean;
  isSymbolicLink: () => boolean;
}

export class MockFileSystem {
  private files = new Map<string, string>();
  private dirs = new Set<string>();

  existsSync(path: string): boolean {
    return this.files.has(path) || this.dirs.has(path);
  }

  readFileSync(path: string): string {
    const content = this.files.get(path);
    if (content === undefined) {
      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    }
    return content;
  }

  writeFileSync(path: string, content: string): void {
    this.files.set(path, content);
    // Ensure parent directories exist
    const dir = path.split('/').slice(0, -1).join('/');
    if (dir) {
      this.dirs.add(dir);
    }
  }

  mkdirSync(path: string, options?: { recursive: boolean }): void {
    if (options?.recursive) {
      // Create all parent directories
      const parts = path.split('/');
      let currentPath = '';
      for (const part of parts) {
        if (!part) continue; // Skip empty parts from leading/trailing slashes
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        this.dirs.add(currentPath);
      }
    } else {
      this.dirs.add(path);
    }
  }

  readdirSync(dirPath: string): string[] {
    return Array.from(this.files.keys())
      .filter(filePath => {
        const dir = filePath.split('/').slice(0, -1).join('/');
        return dir === dirPath;
      })
      .map(filePath => filePath.split('/').pop()!);
  }

  statSync(path: string): MockStats {
    if (this.files.has(path)) {
      return {
        isFile: () => true,
        isDirectory: () => false,
        isSymbolicLink: () => false,
      };
    }
    if (this.dirs.has(path)) {
      return {
        isFile: () => false,
        isDirectory: () => true,
        isSymbolicLink: () => false,
      };
    }
    throw new Error(`ENOENT: no such file or directory, stat '${path}'`);
  }

  clear(): void {
    this.files.clear();
    this.dirs.clear();
  }

  unlinkSync(path: string): void {
    if (!this.files.has(path)) {
      throw new Error(`ENOENT: no such file or directory, unlink '${path}'`);
    }
    this.files.delete(path);
  }

  rmdirSync(path: string, options?: { recursive: boolean }): void {
    if (!this.dirs.has(path)) {
      throw new Error(`ENOENT: no such file or directory, rmdir '${path}'`);
    }

    if (options?.recursive) {
      // Remove all files and subdirectories
      const filesToRemove = Array.from(this.files.keys()).filter(filePath =>
        filePath.startsWith(path + '/')
      );
      filesToRemove.forEach(filePath => this.files.delete(filePath));

      const dirsToRemove = Array.from(this.dirs).filter(dirPath => dirPath.startsWith(path + '/'));
      dirsToRemove.forEach(dirPath => this.dirs.delete(dirPath));
    } else {
      // Check if directory is empty
      const hasFiles = Array.from(this.files.keys()).some(filePath =>
        filePath.startsWith(path + '/')
      );

      const hasSubdirs = Array.from(this.dirs).some(
        dirPath => dirPath !== path && dirPath.startsWith(path + '/')
      );

      if (hasFiles || hasSubdirs) {
        throw new Error(`ENOTEMPTY: directory not empty, rmdir '${path}'`);
      }
    }

    this.dirs.delete(path);
  }
}

export const mockFs = new MockFileSystem();
