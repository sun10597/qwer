from google.cloud import storage
import os
import uuid

def upload_to_gcs(local_path: str, bucket_name: str, destination_dir: str = "") -> str:
    client = storage.Client()
    bucket = client.bucket(bucket_name)

    
    filename = os.path.basename(local_path)
    # 파일명은 고유해야함
    gcs_filename = f"{filename}"

    if destination_dir:
        blob_path = f"test/{gcs_filename}"
    else:
        blob_path = gcs_filename

    blob = bucket.blob(blob_path)
    blob.upload_from_filename(local_path)

    gcs_uri = f"gs://{bucket_name}/{blob_path}"
    print(f"Uploaded to {gcs_uri}")
    return gcs_uri