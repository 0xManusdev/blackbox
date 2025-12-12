import imageCompression from 'browser-image-compression';

/**
 * Removes EXIF and other metadata from image files
 * @param file - The image file to process
 * @returns A new File object without metadata
 */
export async function removeImageMetadata(file: File): Promise<File> {
	// Only process image files
	if (!file.type.startsWith('image/')) {
		return file;
	}

	try {
		const options = {
			maxSizeMB: 5,
			maxWidthOrHeight: 4096,
			useWebWorker: true,
			preserveExif: false, // This removes EXIF data
			fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
		};

		const compressedBlob = await imageCompression(file, options);
		
		// Create a new File object without metadata
		const cleanFile = new File(
			[compressedBlob], 
			file.name, 
			{ 
				type: file.type,
				lastModified: Date.now()
			}
		);

		return cleanFile;
	} catch (error) {
		console.error('Error removing metadata from image:', error);
		// Return original file if processing fails
		return file;
	}
}

/**
 * Processes multiple files and removes metadata from images
 * @param files - Array of files to process
 * @returns Array of processed files
 */
export async function removeMetadataFromFiles(files: File[]): Promise<File[]> {
	const processedFiles = await Promise.all(
		files.map(file => removeImageMetadata(file))
	);
	return processedFiles;
}
