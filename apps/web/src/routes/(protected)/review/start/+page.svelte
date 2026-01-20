<script lang="ts">
  export let data;

  let currentIndex = 0;
  let userAnswer = '';
  let isSubmitting = false;
  let feedback: null | {
    isCorrect: boolean;
    correctAnswer: string;
  } = null;

  const questions = data.questions;

  const currentQuestion = () => questions[currentIndex];

  async function submitAnswer() {
    if (!userAnswer.trim()) return;

    isSubmitting = true;

    const res = await fetch('/api/dashboard/review/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId: currentQuestion().questionId,
        userAnswer
      })
    });

    if (!res.ok) {
      isSubmitting = false;
      throw new Error('Failed to submit answer');
    }

    feedback = await res.json();
    isSubmitting = false;
  }

  function nextQuestion() {
    feedback = null;
    userAnswer = '';
    currentIndex += 1;
  }
</script>

{#if questions.length === 0}
  <p class="empty">Nothing to review today!</p>
{:else}
  <section class="review">
    <div class="progress">
      {currentIndex + 1} / {questions.length}
    </div>

    <div class="card">
      <p class="type">
        {currentQuestion().scriptType.toUpperCase()} · {currentQuestion().questionType}
      </p>

      <h2 class="question">
        {currentQuestion().questionText}
      </h2>

      {#if !feedback}
        {#if currentQuestion().questionType === 'meaning'}
          <div class="options">
            {#each currentQuestion().options as option}
              <button
                class="option"
                on:click={() => (userAnswer = option)}
                disabled={isSubmitting}
              >
                {option}
              </button>
            {/each}
          </div>
        {:else}
          <input
            class="input"
            placeholder="Type your answer"
            bind:value={userAnswer}
            disabled={isSubmitting}
          />
        {/if}

        <button class="submit" on:click={submitAnswer} disabled={isSubmitting}>
          Check
        </button>
      {:else}
        <div class="feedback {feedback.isCorrect ? 'correct' : 'wrong'}">
          {#if feedback.isCorrect}
            ✅ Correct!
          {:else}
            ❌ Incorrect  
            <span class="answer">Correct: {feedback.correctAnswer}</span>
          {/if}
        </div>

        <button class="next" on:click={nextQuestion}>
          Next
        </button>
      {/if}
    </div>
  </section>
{/if}

<style>
  .review {
    max-width: 420px;
    margin: 3rem auto;
    text-align: center;
  }

  .progress {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .type {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 0.5rem;
  }

  .question {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .options {
    display: grid;
    gap: 0.5rem;
  }

  .option {
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #fafafa;
    cursor: pointer;
  }

  .input {
    width: 90%;
    padding: 0.75rem;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .submit,
  .next {
    margin-top: 1rem;
    padding: 0.75rem;
    width: 100%;
    border-radius: 8px;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }

  .submit {
    background: #457b9d;
    color: white;
  }

  .next {
    background: #2a9d8f;
    color: white;
  }

  .feedback {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .feedback.correct {
    color: #2a9d8f;
  }

  .feedback.wrong {
    color: #e63946;
  }

  .answer {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #444;
  }

  .empty {
    text-align: center;
    margin-top: 4rem;
    font-size: 1.2rem;
  }
</style>
