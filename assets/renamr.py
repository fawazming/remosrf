import os


def rename_images():
  # Mapping of original filenames to new descriptive slugs
  rename_mapping = {
      "IMG-20261103-WA0003.jpg": (
          "mobile-digital-class-outdoor-stem-workshop.jpg"
      ),
      "IMG-20261103-WA0004.jpg": (
          "mobile-digital-class-tent-presentation.jpg"
      ),
      "IMG-20261103-WA0005.jpg": (
          "mobile-digital-class-interior-side-view.jpg"
      ),
      "IMG-20261031-WA0005.jpg": "remo-srf-official-logo.jpg",
      "IMG-20261101-WA0027.jpg": "staff-id-card-and-official-envelope.jpg",
      "IMG-20261103-WA0001.jpg": "stem-education-hall-seminar.jpg",
      "IMG-20261103-WA0002.jpg": (
          "aerial-view-mobile-digital-class-outreach.jpg"
      ),
  }

  print("Starting image renaming process...\n")

  for old_name, new_name in rename_mapping.items():
    if os.path.exists(old_name):
      if not os.path.exists(new_name):
        os.rename(old_name, new_name)
        print(f"[SUCCESS] Renamed: '{old_name}' -> '{new_name}'")
      else:
        print(
            f"[SKIPPED] Target file '{new_name}' already exists. Skipping"
            f" '{old_name}'."
        )
    else:
      print(
          f"[WARNING] Original file '{old_name}' not found in current directory."
      )

  print("\nRenaming process completed!")


if __name__ == "__main__":
  rename_images()
