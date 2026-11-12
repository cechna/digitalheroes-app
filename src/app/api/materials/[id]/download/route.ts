import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/services/auth';
import { repository } from '@/lib/services/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Autenticazione richiesta per scaricare i materiali.' },
        { status: 401 }
      );
    }

    const { id: materialId } = await params;
    const authCheck = await repository.canUserDownloadMaterial(materialId, user.id);

    if (!authCheck.allowed) {
      return NextResponse.json(
        { error: authCheck.reason || 'Accesso non autorizzato a questo materiale.' },
        { status: 403 }
      );
    }

    const file = await repository.getMaterialDownload(materialId, user.id);
    if (!file) {
      return NextResponse.json({ error: 'File non reperibile.' }, { status: 404 });
    }

    const buffer = Buffer.from(file.dataBase64, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': buffer.length.toString(),
        // Non memorizzare file riservati nella cache pubblica o del browser
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore download file';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
