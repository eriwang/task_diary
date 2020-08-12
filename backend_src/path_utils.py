import os


def create_file_parent_directories_if_needed(filepath):
    parent_dir = os.path.dirname(filepath)
    if parent_dir != '' and not os.path.exists(parent_dir):
        os.makedirs(parent_dir)
