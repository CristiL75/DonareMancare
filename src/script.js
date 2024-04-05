document.addEventListener('DOMContentLoaded', () => {
    const createSessionBtn = document.getElementById('createSessionBtn');
    const joinSessionBtn = document.getElementById('joinSessionBtn');
    const codeEditor = document.getElementById('codeEditor');
    const editor = CodeMirror.fromTextArea(codeEditor,{
        lineNumbers:true,
        mode: 'javascript'
    })


    createSessionBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/createSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log('Session created:', data.sessionId);
            // Redirecționează utilizatorul către pagina "work.html"
            window.location.href = '/work.html';
        } catch (error) {
            console.error('Error creating session:', error);
        }
    });
    

    joinSessionBtn.addEventListener('click', async () => {
        const sessionId = prompt('Enter session ID:');
        if (sessionId) {
            try {
                const response = await fetch(`/joinSession/${sessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Joined session successfully:', sessionId);
                    window.location.href = '/work.html';
                } else {
                    console.error('Failed to join session:', data.error);
                }
            } catch (error) {
                console.error('Error joining session:', error);
            }
        }
    });
    editor.on('change', (instance, changeObj)=>{
        const code = instance.getValue();
    });
});
